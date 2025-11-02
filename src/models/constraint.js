const mongoose = require("mongoose");

const ConstraintSchema = new mongoose.Schema(
    {
        min_ticket_price: {
            type: Number,
            required: true
        },
        max_ticket_price: {
            type: Number,
            required: true
        },
        min_product_price: {
            type: Number,
            required: true
        },
        max_product_price: {
            type: Number,
            required: true
        },
        open_time: {
            type: String,
            required: true
        },
        close_time: {
            type: String,
            required: true
        },
        time_gap: {
            type: Number,
            required: true
        },
        employee_min_age: {
            type: Number,
            required: true
        },
        employee_max_age: {
            type: Number,
            required: true
        },
        reservation_time: {
            type: Number,
            required: true
        },
        bronze_member: {
            type: Number,
            required: true,
            default: 1000, // example: 1000 points to start
            min: 0
        },
        silver_member: {
            type: Number,
            required: true,
            default: 3000, // example: 3000 points
            min: 0
        },
        gold_member: {
            type: Number,
            required: true,
            default: 5000, // example: 5000 points
            min: 0
        },
    }
);

const Constraint = mongoose.model("Constraints", ConstraintSchema);

module.exports = Constraint;