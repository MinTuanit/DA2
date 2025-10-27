const movieservice = require("../services/movie.service");

const createMovie = async (req, res) => {
    try {
        const movie = await movieservice.createMovie(req.body);
        return res.status(201).json(movie);
    } catch (error) {
        console.log("Server Error! ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await movieservice.getAllMovies();
        return res.status(200).json(movies);
    } catch (error) {
        console.log("Server Error! ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await movieservice.getMovieById(req.params.id);
        if (!movie) {
            // console.log("Movie not found!");
            return res.status(404).json({ error: { message: "Movie not found!" } });
        }
        return res.status(200).json(movie);
    } catch (error) {
        // console.log("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const getMovieByStatus = async (req, res) => {
    try {
        let { status } = req.query;

        if (!status) {
            return res.status(400).json({ error: { message: "Status is required!" } });
        }

        if (typeof status === 'string') {
            status = status.split(',').map(s => s.trim());
        }

        const movies = await movieservice.getMovieByStatus(status);

        return res.status(200).json(movies);
    } catch (error) {
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const deleteMovieById = async (req, res) => {
    try {
        const movie = await movieservice.deleteMovieById(req.params.id);
        if (!movie) {
            console.log("Movie not found!");
            return res.status(404).json({ error: { message: "Movie not found!" } });
        }
        return res.status(200).json({ message: "Delete movie successfully." });
    } catch (error) {
        console.log("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

const updateMovieById = async (req, res) => {
    try {
        const movie = await movieservice.updateMovieById(
            req.params.id,
            req.body
        );
        if (!movie) {
            console.log("Movie not found!");
            return res.status(404).json({ error: { message: "Movie not found!" } });
        }
        return res.status(200).json(movie);
    } catch (error) {
        console.log("Server Error: ", error);
        return res.status(500).json({ error: { message: "Server Error!" } });
    }
};

module.exports = {
    createMovie,
    updateMovieById,
    getAllMovies,
    deleteMovieById,
    getMovieById,
    getMovieByStatus
};