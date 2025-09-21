const router = require("express").Router();
const cinemacontroller = require("../controllers/cinemacontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const cinemaValidation = require("../validations/cinema");

router.get(
  "/",
  auth("getCinema"),
  cinemacontroller.getAllCinemas
);

router.get(
  "/employeeandroom",
  auth("getCinema"),
  cinemacontroller.getAllCinemasWithCounts
);

router.get(
  "/:id",
  auth("getCinema"),
  cinemacontroller.getCinemaById
);

router.post(
  "/",
  auth("manageCinema"),
  validate(cinemaValidation.createCinema),
  cinemacontroller.createCinema
);

router.patch(
  "/:id",
  auth("manageCinema"),
  validate(cinemaValidation.updateCinema),
  cinemacontroller.updateCinemaById
);

router.delete(
  "/:id",
  auth("manageCinema"),
  cinemacontroller.deleteCinemaById
);

module.exports = router;