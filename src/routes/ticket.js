const router = require("express").Router();
const ticketcontroller = require("../controllers/ticketcontroller");
const validate = require("../middlewares/validate");
const ticketValidation = require("../validations/ticket");

router.get(
  "/",
  ticketcontroller.getAllTickets
);

router.get(
  "/user/:userid",
  ticketcontroller.getTicketByUserId
);

router.get(
  "/:id",
  ticketcontroller.getTicketById
);

router.post(
  "/",
  validate(ticketValidation.createTicket),
  ticketcontroller.createTicket
);

router.patch(
  "/:id",
  validate(ticketValidation.updateTicket),
  ticketcontroller.updateTicketById
);

router.delete(
  "/order/:orderid",
  ticketcontroller.deleteTicketByOrderId
);

router.delete(
  "/showtime/:showtimeid",
  ticketcontroller.deleteTicketByShowTimeId
);

router.delete(
  "/:id",
  ticketcontroller.deleteTicketById
);

module.exports = router;