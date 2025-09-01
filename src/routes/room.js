const router = require("express").Router();
const roomcontroller = require("../controllers/roomcontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const roomValidation = require("../validations/room");

router.get(
  "/",
  auth("getRoom"),
  roomcontroller.getAllRooms
);

router.get(
  "/:id",
  auth("getRoom"),
  roomcontroller.getRoomById
);

router.get(
  "/cinema/:cinemaid",
  auth("getRoom"),
  roomcontroller.getRoomByCinemaId
);

router.post(
  "/seats",
  auth("manageRoom"),
  validate(roomValidation.createRoom),
  roomcontroller.createRoomWithSeats
);

router.post(
  "/",
  auth("manageRoom"),
  validate(roomValidation.updateRoom),
  roomcontroller.createRoom
);

router.patch(
  "/:id",
  auth("manageRoom"),
  roomcontroller.updateRoomWithSeatsById
);

router.delete(
  "/:id",
  auth("manageRoom"),
  roomcontroller.deleteRoomById
);

module.exports = router;