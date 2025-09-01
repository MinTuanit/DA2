const router = require("express").Router();
const seatcontroller = require("../controllers/seatcontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const seatValidation = require("../validations/seat");

router.get(
  "/",
  auth("getSeat"),
  seatcontroller.getAllSeats
);

router.get(
  "/room/:roomid",
  auth("getSeat"),
  seatcontroller.getSeatByRoomId
);

router.get(
  "/:id",
  auth("getSeat"),
  seatcontroller.getSeatById
);

router.get(
  "/showtime/:showtimeid",
  auth("getSeat"),
  seatcontroller.getSeatByShowtimeId
);

router.post(
  "/room/",
  auth("manageSeat"),
  seatcontroller.createSeats
);

router.post(
  "/room/resetseats/",
  auth("manageSeat"),
  seatcontroller.resetSeats
);

router.post(
  "/",
  auth("manageSeat"),
  validate(seatValidation.createSeat),
  seatcontroller.createSeat
);

router.patch(
  "/:id",
  auth("manageSeat"),
  validate(seatValidation.updateSeat),
  seatcontroller.updateSeatById
);

router.delete(
  "/room/:roomid",
  auth("manageSeat"),
  seatcontroller.deleteSeatByRoomId
);

router.delete(
  "/:id",
  auth("manageSeat"),
  seatcontroller.deleteSeatById
);

module.exports = router;