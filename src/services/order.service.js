const Order = require("../models/order");
const Discount = require("../models/discount");
const OrderProductDetail = require("../models/orderproductdetail");
const Ticket = require("../models/ticket");
const sendOrderConfirmationEmail = require('../utils/email');
const { updateLoyaltyPoints } = require('../services/user.service');
const formatDate = require("../utils/formatdate");
const puppeteer = require('puppeteer');
const generateOrderHtml = require('../utils/generateOrderHtml');
const generateUniqueOrderCode = require('../utils/generateUniqueOrderCode');
const mongoose = require('mongoose');

async function createOrder(data) {
  const ordercode = await generateUniqueOrderCode();
  const newOrder = new Order({
    ordercode,
    total_price: data.total_price,
    status: data.status || 'pending',
    user_id: data.user_id,
  });
  await newOrder.save();
  return newOrder;
}

async function createOrders(data) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const {
      total_price,
      user_id,
      products,
      tickets,
      status,
      email,
      amount,
      payment_method,
      discount_id
    } = data;

    const ordercode = await generateUniqueOrderCode();

    // Check ghế đã được đặt hay chưa
    if (tickets && tickets.seats.length > 0) {
      const existingTicket = await Ticket.find({
        showtime_id: tickets.showtime_id,
        seat_id: { $in: tickets.seats.map(seat => seat.seat_id) }
      });
      if (existingTicket.length > 0) {
        await session.abortTransaction();
        return { error: "Seat is reserved!" };
      }
    }

    // Tạo Order
    const order = new Order({
      ordercode,
      total_price,
      user_id: user_id || null,
      status: status || "completed",
      ordered_at: new Date(),
      amount,
      payment_method,
      discount_id: discount_id || null,
      paid_at: new Date()
    });
    await order.save({ session });

    // Thêm sản phẩm vào chi tiết đơn
    if (products?.length > 0) {
      const orderProducts = products.map(p => ({
        order_id: order._id,
        product_id: p.product_id,
        quantity: p.quantity,
      }));
      await OrderProductDetail.insertMany(orderProducts, { session });
    }

    // Thêm vé vào chi tiết đơn
    if (tickets?.seats?.length > 0) {
      const ticketDocs = tickets.seats.map(s => ({
        order_id: order._id,
        showtime_id: tickets.showtime_id,
        seat_id: s.seat_id,
      }));
      await Ticket.insertMany(ticketDocs, { session });
    }

    // Cập nhật giảm giá nếu có
    if (discount_id) {
      await Discount.findByIdAndUpdate(
        discount_id,
        { $inc: { remaining: -1 } },
        { session }
      );
    }

    await session.commitTransaction();

    if (order.user_id) {
      try {
        await updateLoyaltyPoints(order.user_id, total_price);
      } catch (err) {
        console.error('Error updating loyalty points:', err.message);
      }
    }

    // Lấy lại dữ liệu đã populate
    const [populatedTickets, populatedProducts] = await Promise.all([
      Ticket.find({ order_id: order._id })
        .populate({ path: "seat_id", select: "seat_name seat_column" })
        .populate({
          path: "showtime_id",
          select: "price showtime",
          populate: [
            { path: "movie_id", select: "title" },
            {
              path: "room_id",
              select: "name cinema_id",
              populate: { path: "cinema_id", select: "name address" }
            }
          ]
        }),
      OrderProductDetail.find({ order_id: order._id })
        .populate({ path: "product_id", select: "name price" })
    ]);

    const productDetails = populatedProducts.map(p => ({
      name: p.product_id?.name || "",
      quantity: p.quantity
    }));

    // Gửi email xác nhận nếu có email
    // Gửi email xác nhận nếu có email
    if (email) {
      try {
        const showtime = populatedTickets[0]?.showtime_id;
        const cinemaName = showtime?.room_id?.cinema_id?.name;
        const movieName = showtime?.movie_id?.title;
        const simplifiedTickets = populatedTickets.map(t => ({
          seat_name: t.seat_id?.seat_name,
          price: t.showtime_id?.price,
        }));

        // Thêm thông tin sản phẩm
        const simplifiedProducts = populatedProducts.map(p => ({
          name: p.product_id?.name || "",
          price: p.product_id?.price || 0,
          quantity: p.quantity,
          total: (p.product_id?.price || 0) * p.quantity
        }));

        sendOrderConfirmationEmail({
          toEmail: email,
          ordercode,
          tickets: simplifiedTickets,
          products: simplifiedProducts,
          totalPrice: total_price,
          showtime: {
            datetime: showtime?.showtime,
            room_name: showtime?.room_id?.name
          },
          cinemaName,
          cinemaAddress: showtime?.room_id?.cinema_id?.address,
          movieName
        });
      } catch (emailErr) {
        console.error("Error sending confirmation email: ", emailErr.message);
      }
    }

    // Xuất file PDF bằng Puppeteer
    const html = generateOrderHtml({
      ordercode,
      ordered_at: formatDate(order.ordered_at),
      total_price,
      populatedTickets,
      populatedProducts: productDetails
    });
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return { pdfBuffer, ordercode, order_id: order._id };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
}

async function getAllOrders() {
  const orders = await Order.find()
    .populate({ path: "discount_id", select: "code" })
    .populate({ path: "user_id", select: "full_name email" });

  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      const [tickets, orderProducts] = await Promise.all([
        Ticket.find({ order_id: order._id })
          .populate({ path: "showtime_id", populate: { path: "movie_id", model: "Movies" } })
          .populate("seat_id"),
        OrderProductDetail.find({ order_id: order._id })
          .populate({ path: "product_id", model: "Products" })
      ]);

      const ticketDetails = tickets.map(ticket => ({
        title: ticket.showtime_id?.movie_id?.title || "",
        showtime: ticket.showtime_id?.showtime || "",
        price: ticket.showtime_id?.price || 0,
        seats: ticket.seat_id ? [{
          seat_id: ticket.seat_id._id,
          seat_name: ticket.seat_id.seat_name
        }] : []
      }));

      const productDetails = orderProducts.map(product => ({
        product_id: product.product_id?._id || null,
        name: product.product_id?.name || "",
        price: product.product_id?.price || 0,
        quantity: product.quantity,
        total: (product.product_id?.price || 0) * product.quantity
      }));
      console.log(order);
      return {
        _id: order._id,
        ordercode: order.ordercode,
        total_price: order.total_price,
        status: order.status,
        ordered_at: order.ordered_at,
        user: order.user_id ? {
          _id: order.user_id._id,
          email: order.user_id.email,
          name: order.user_id.full_name || ""
        } : null,
        amount: order.amount,
        payment_method: order.payment_method,
        paid_at: order.paid_at,
        discount: order.discount_id ? {
          discount_id: order.discount_id._id,
          code: order.discount_id.code
        } : null,
        ticketCount: tickets.length,
        productCount: orderProducts.length,
        tickets: ticketDetails,
        products: productDetails
      };
    })
  );

  return ordersWithDetails;
}

async function getOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate({ path: "discount_id", select: "code" })
    .populate({ path: "user_id", select: "full_name email" });

  if (!order) return null;

  const [tickets, orderProducts] = await Promise.all([
    Ticket.find({ order_id: order._id })
      .populate({ path: "showtime_id", populate: { path: "movie_id", model: "Movies" } })
      .populate("seat_id"),
    OrderProductDetail.find({ order_id: order._id })
      .populate({ path: "product_id", model: "Products" })
  ]);

  const ticketDetails = tickets.map(ticket => ({
    title: ticket.showtime_id?.movie_id?.title || "",
    showtime: ticket.showtime_id?.showtime || "",
    price: ticket.showtime_id?.price || 0,
    seats: ticket.seat_id ? [{
      seat_id: ticket.seat_id._id,
      seat_name: ticket.seat_id.seat_name
    }] : []
  }));

  const productDetails = orderProducts.map(product => ({
    product_id: product.product_id?._id || null,
    name: product.product_id?.name || "",
    price: product.product_id?.price || 0,
    quantity: product.quantity,
    total: (product.product_id?.price || 0) * product.quantity
  }));

  return {
    _id: order._id,
    ordercode: order.ordercode,
    total_price: order.total_price,
    status: order.status,
    ordered_at: order.ordered_at,
    user: order.user_id ? {
      _id: order.user_id._id,
      email: order.user_id.email,
      name: order.user_id.full_name || ""
    } : null,
    amount: order.amount,
    payment_method: order.payment_method,
    paid_at: order.paid_at,
    discount: order.discount_id ? {
      discount_id: order.discount_id._id,
      code: order.discount_id.code
    } : null,
    ticketCount: tickets.length,
    productCount: orderProducts.length,
    tickets: ticketDetails,
    products: productDetails
  };
}

async function getOrderByCode(ordercode) {
  const order = await Order.findOne({ ordercode });
  if (!order) return null;

  const [tickets, products] = await Promise.all([
    Ticket.find({ order_id: order._id })
      .populate({ path: "seat_id", select: "seat_name seat_column" })
      .populate({
        path: "showtime_id",
        populate: [
          { path: "movie_id", select: "title" },
          {
            path: "room_id",
            select: "name cinema_id",
            populate: { path: "cinema_id", select: "name address" }
          }
        ]
      }),
    OrderProductDetail.find({ order_id: order._id })
      .populate({
        path: "product_id",
        model: "Products",
        select: "name price"
      })
  ]);

  const productDetails = products.map(p => ({
    name: p.product_id?.name || "",
    price: p.product_id?.price || 0,
    quantity: p.quantity,
    total: (p.product_id?.price || 0) * p.quantity
  }));

  const html = generateOrderHtml({
    ordercode,
    ordered_at: formatDate(order.ordered_at),
    total_price: order.total_price,
    populatedTickets: tickets,
    populatedProducts: productDetails
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return { pdfBuffer, ordercode };
}

async function getOrderWithInfoById(id) {
  const order = await Order.findById(id)
    .populate('user_id', 'full_name phone')
    .lean();
  if (!order) return null;

  const [orderProducts, tickets] = await Promise.all([
    OrderProductDetail.find({ order_id: id })
      .populate('product_id', 'name price category')
      .lean(),
    Ticket.find({ order_id: id })
      .populate([
        {
          path: 'showtime_id',
          select: 'start_time movie_id',
          populate: { path: 'movie_id', select: 'title' }
        },
        { path: 'seat_id', select: 'seat_name seat_column' }
      ])
      .lean()
  ]);

  const products = orderProducts.map(p => ({
    product_id: p.product_id._id,
    name: p.product_id.name,
    price: p.product_id.price,
    category: p.product_id.category,
    quantity: p.quantity
  }));

  const ticketDetails = tickets.map(t => ({
    ticket_id: t._id,
    showtime: {
      showtime_id: t.showtime_id._id,
      start_time: t.showtime_id.start_time,
      movie_title: t.showtime_id.movie_id.title
    },
    seat: {
      seat_id: t.seat_id._id,
      seat_row: t.seat_id.seat_name,
      seat_number: t.seat_id.seat_column
    }
  }));

  return {
    order: {
      order_id: order._id,
      ordercode: order.ordercode,
      total_price: order.total_price,
      status: order.status,
      ordered_at: order.ordered_at,
      payment_method: order.payment_method,
      amount: order.amount,
      paid_at: order.paid_at,
      discount_id: order.discount_id,
      user: order.user_id
        ? {
          user_id: order.user_id._id,
          full_name: order.user_id.full_name,
          phone: order.user_id.phone
        }
        : null
    },
    products,
    tickets: ticketDetails
  };
}

async function getOrderByUserId(userId) {
  const orders = await Order.find({ user_id: userId }).lean();
  if (!orders || orders.length === 0) return null;

  const detailedOrders = await Promise.all(
    orders.map(async (order) => {
      const [tickets, orderProducts] = await Promise.all([
        Ticket.find({ order_id: order._id })
          .populate({
            path: 'showtime_id',
            populate: {
              path: 'movie_id',
              model: 'Movies',
              select: 'title'
            }
          })
          .populate('seat_id')
          .lean(),

        OrderProductDetail.find({ order_id: order._id })
          .populate({
            path: 'product_id',
            model: 'Products',
            select: 'name price category'
          })
          .lean()
      ]);

      const ticketDetails = tickets.map(ticket => ({
        title: ticket.showtime_id?.movie_id?.title || '',
        start_time: ticket.showtime_id?.start_time || '',
        seats: ticket.seat_id
          ? [{
            seat_id: ticket.seat_id._id,
            seat_name: ticket.seat_id.seat_name,
            seat_column: ticket.seat_id.seat_column
          }]
          : []
      }));

      const productDetails = orderProducts.map(product => ({
        product_id: product.product_id?._id || null,
        name: product.product_id?.name || '',
        price: product.product_id?.price || 0,
        category: product.product_id?.category || null,
        quantity: product.quantity
      }));

      return {
        order_id: order._id,
        ordercode: order.ordercode,
        total_price: order.total_price,
        status: order.status,
        ordered_at: order.ordered_at,
        payment_method: order.payment_method,
        amount: order.amount,
        paid_at: order.paid_at,
        discount_id: order.discount_id,
        ticketCount: tickets.length,
        productCount: orderProducts.length,
        tickets: ticketDetails,
        products: productDetails
      };
    })
  );

  return detailedOrders;
}
async function deleteOrderById(id) {
  const order = await Order.findById(id);
  if (!order) return null;

  await Ticket.deleteMany({ order_id: id });
  await OrderProductDetail.deleteMany({ order_id: id });

  await Order.findByIdAndDelete(id);
  return order;
}
async function deleteOrderByUserId(userid) {
  const result = await Order.deleteMany({ user_id: userid });
  return result;
}

async function updateOrderById(orderId, body) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      await session.abortTransaction();
      session.endSession();
      return { error: "Order not found!" };
    }

    if (existingOrder.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return {
        error: `Unable to update order with status: "${existingOrder.status}"`,
      };
    }

    const allowedUpdates = [
      "user_id",
      "total_price",
      "status",
      "email", // nếu vẫn còn field email
      "products",
      "tickets",
      "amount",
      "payment_method",
      "discount_id",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    // gán dữ liệu mới vào đơn hàng
    Object.assign(existingOrder, updates);

    // nếu có cập nhật payment thì set lại paid_at
    if ("amount" in updates || "payment_method" in updates) {
      existingOrder.paid_at = new Date();
    }

    await existingOrder.save({ session });

    // cập nhật sản phẩm trong đơn
    if ("products" in updates) {
      await OrderProductDetail.deleteMany({ order_id: orderId }).session(session);
      const orderProducts = updates.products.map((p) => ({
        order_id: orderId,
        product_id: p.product_id,
        quantity: p.quantity,
      }));
      await OrderProductDetail.insertMany(orderProducts, { session });
    }

    // cập nhật vé trong đơn
    if ("tickets" in updates) {
      await Ticket.deleteMany({ order_id: orderId }).session(session);
      const ticketDocs = updates.tickets.map((t) => ({
        order_id: orderId,
        showtime_id: t.showtime_id,
        seat_id: t.seat_id,
      }));
      await Ticket.insertMany(ticketDocs, { session });
    }

    // nếu có discount thì trừ usage
    if (updates.discount_id) {
      await Discount.findByIdAndUpdate(
        updates.discount_id,
        { $inc: { max_usage: -1 } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { message: "Update order successfully.", order: existingOrder };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = {
  createOrder,
  createOrders,
  getOrderById,
  getAllOrders,
  getOrderById,
  getOrderByCode,
  getOrderWithInfoById,
  getOrderByUserId,
  deleteOrderById,
  deleteOrderByUserId,
  updateOrderById
};