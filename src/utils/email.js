const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

const buildOrderEmailHtml = (ordercode, tickets, totalPrice, showtime, cinemaName, movieName, products = [], cinemaAddress = '') => {
    const ticketRows = tickets.map((t, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">Ghế ${t.seat_name}</td>
            <td style="text-align: center;">${t.price}</td>
        </tr>
    `).join('');

    const productRows = products.map((p, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: center;">${p.name}</td>
            <td style="text-align: center;">${p.quantity}</td>
            <td style="text-align: center;">${p.price}</td>
            <td style="text-align: center;">${p.total}</td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif;">
        <h2 style="color: purple;">XÁC NHẬN ĐẶT VÉ THÀNH CÔNG</h2>
        <p><strong>Mã vé:</strong> ${ordercode}</p>
        <p><strong>Phim:</strong> ${movieName}</p>
        <p><strong>Suất chiếu:</strong> ${new Date(showtime.datetime).toLocaleString('vi-VN')}</p>
        <p><strong>Phòng chiếu:</strong> ${showtime.room_name}</p>
        <p><strong>Rạp:</strong> ${cinemaName}</p>
        ${cinemaAddress ? `<p><strong>Địa chỉ:</strong> ${cinemaAddress}</p>` : ''}
        <p><strong>Số ghế:</strong> ${tickets.length}</p>

        <h3 style="color: purple; margin-top: 20px;">VÉ XEM PHIM</h3>
        <table style="width:100%; border-collapse: collapse;" border="1">
            <thead>
                <tr style="background: #800080; color: white;">
                    <th>STT</th>
                    <th>Ghế</th>
                    <th>Giá vé</th>
                </tr>
            </thead>
            <tbody>
                ${ticketRows}
            </tbody>
        </table>

        ${products.length > 0 ? `
        <h3 style="color: purple; margin-top: 20px;">SẢN PHẨM KHÁC</h3>
        <table style="width:100%; border-collapse: collapse;" border="1">
            <thead>
                <tr style="background: #800080; color: white;">
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${productRows}
            </tbody>
        </table>
        ` : ''}

        <p style="text-align: right; margin-top: 15px;"><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString('vi-VN')} VNĐ</p>
        <p>Cảm ơn Quý khách đã xem phim tại <strong>${cinemaName}</strong>${cinemaAddress ? ` (Địa chỉ: ${cinemaAddress})` : ''}. Chúc Quý khách một buổi xem phim vui vẻ.</p>
    </div>
    `;
};

const sendOrderConfirmationEmail = async ({ toEmail, ordercode, tickets, totalPrice, showtime, cinemaName, movieName, products = [], cinemaAddress = '' }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const html = buildOrderEmailHtml(ordercode, tickets, totalPrice, showtime, cinemaName, movieName, products, cinemaAddress);

    const mailOptions = {
        from: `"Rạp Chiếu Phim" <${process.env.MAIL_USERNAME}>`,
        to: toEmail,
        subject: 'Xác nhận đặt vé thành công',
        html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOrderConfirmationEmail;