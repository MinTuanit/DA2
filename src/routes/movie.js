const router = require("express").Router();
const moviecontroller = require("../controllers/moviecontroller");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const movieValidation = require("../validations/movie");

router.get(
  "/status",
  moviecontroller.getMovieByStatus
);

router.get(
  "/",
  moviecontroller.getAllMovies
);

router.get(
  "/:id",
  moviecontroller.getMovieById
);

router.post(
  "/",
  auth("manageMovie"),
  validate(movieValidation.createMovie),
  moviecontroller.createMovie
);

router.patch(
  "/:id",
  auth("manageMovie"),
  validate(movieValidation.updateMovie),
  moviecontroller.updateMovieById
);

router.delete(
  "/:id",
  auth("manageMovie"),
  moviecontroller.deleteMovieById
);

module.exports = router;