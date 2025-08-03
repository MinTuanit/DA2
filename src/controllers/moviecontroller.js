const movieservice = require("../services/movie.service");

const createMovie = async (req, res) => {
    try {
        const movie = await movieservice.createMovie(req.body);
        return res.status(201).json(movie);
    } catch (error) {
        console.log("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await movieservice.getAllMovies();
        return res.status(200).json(movies);
    } catch (error) {
        console.log("Lỗi server! ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await movieservice.getMovieById(req.params.id);
        if (!movie) {
            console.log("Phim không tồn tại!");
            return res.status(404).json({ error: { message: "Phim không tồn tại" } });
        }
        return res.status(200).json(movie);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const getMovieByStatus = async (req, res) => {
    try {
        let { status } = req.query;

        if (!status) {
            return res.status(400).json({ error: { message: "Thiếu trạng thái phim" } });
        }

        if (typeof status === 'string') {
            status = status.split(',').map(s => s.trim());
        }

        const movies = await movieservice.getMovieByStatus(status);

        return res.status(200).json(movies);
    } catch (error) {
        console.error("Lỗi khi lấy phim theo trạng thái:", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const deleteMovieById = async (req, res) => {
    try {
        const movie = await movieservice.deleteMovieById(req.params.id);
        if (!movie) {
            console.log("Phim không tồn tại!");
            return res.status(404).json({ error: { message: "Phim không tồn tại" } });
        }
        return res.status(200).json({ message: "Xóa phim thành công" });
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
    }
};

const updateMovieById = async (req, res) => {
    try {
        const movie = await movieservice.updateMovieById(
            req.params.id,
            req.body
        );
        if (!movie) {
            console.log("Phim không tồn tại!");
            return res.status(404).json({ error: { message: "Phim không tồn tại" } });
        }
        return res.status(200).json(movie);
    } catch (error) {
        console.log("Lỗi server: ", error);
        return res.status(500).json({ error: { message: "Lỗi Server" } });
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