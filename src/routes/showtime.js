const router = require("express").Router();
const showtimecontroller = require("../controllers/showtimecontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const showtimeValidation = require("../validations/showtime");

router.get(
  "/",
  auth("getShowTime"),
  showtimecontroller.getAllShowTimes
);

router.get(
  "/current",
  showtimecontroller.getCurrentShowtime
);

router.get(
  "/:id",
  auth("getShowTime"),
  showtimecontroller.getShowTimeById
);

router.get(
  "/movie/:movieid",
  auth("getShowTime"),
  showtimecontroller.getShowTimeByMovieId
);

router.post(
  "/",
  auth("manageShowTime"),
  validate(showtimeValidation.createShowtime),
  showtimecontroller.createShowTime
);

router.patch(
  "/:id",
  auth("manageShowTime"),
  validate(showtimeValidation.updateShowtime),
  showtimecontroller.updateShowTimeById
);

router.delete(
  "/:id",
  auth("manageShowTime"),
  showtimecontroller.deleteShowTimeById
);

module.exports = router;