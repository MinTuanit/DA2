const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Movie = require('../models/movie');
const Product = require('../models/product');
const Constraint = require('../models/constraint');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const filePath = path.join(__dirname, '../prompt/cinema_info.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');

async function buildPrompt() {
    const nowPlayingMovies = await Movie.find({ status: "Now Playing" }).select('title');
    const comingSoonMovies = await Movie.find({ status: "Coming Soon" }).select('title');
    const products = await Product.find().select('name');
    const constraint = await Constraint.findOne();

    const allMovies = [...nowPlayingMovies, ...comingSoonMovies];
    const movieList = allMovies.map(m => `- ${m.title}`).join('\n');
    const productList = products.map(p => `- ${p.name}`).join('\n');

    let constraintInfo = '';
    if (constraint) {
        constraintInfo =
            `Giờ mở cửa: ${constraint.open_time}\n` +
            `Giờ đóng cửa: ${constraint.close_time}\n` +
            `Giá vé phim: từ ${constraint.min_ticket_price} đến ${constraint.max_ticket_price} VNĐ\n`;
    }

    return (
        fileContent +
        constraintInfo +
        `Danh sách phim:\n${movieList}\n\n` +
        `Danh sách đồ ăn:\n${productList}\n`
    );
}

const chatbot = async (req, res) => {
    try {
        // Fetch all movies with their titles, poster_url, and IDs
        const movies = await Movie.find({ status: { $in: ["Now Playing", "Coming Soon"] } }).select('title poster_url _id');

        const systemPrompt = await buildPrompt();
        console.log('Prompt content:\n', systemPrompt);

        // Sử dụng Gemini 2.0 Flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Kết hợp system prompt với user message
        const fullPrompt = `${systemPrompt}\n\nUser question: ${req.body.message}\n\nPlease respond in Vietnamese and be helpful about cinema information.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const reply = response.text();

        // Find mentioned movies in the reply and include id, title, poster_url
        const mentionedMovies = movies
            .filter(m => reply.toLowerCase().includes(m.title.toLowerCase()))
            .map(m => ({
                id: m._id,
                title: m.title,
                poster_url: m.poster_url
            }));

        return res.json({
            reply,
            mentionedMovies,
            model: "gemini-2.0-flash-exp"
        });
    } catch (err) {
        console.error('Gemini API Error:', err.message);
        return res.status(500).json({ error: 'Server Error!', details: err.message });
    }
};


module.exports = {
    chatbot
}