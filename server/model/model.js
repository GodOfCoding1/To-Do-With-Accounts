const mongoose = require("mongoose");

var schme = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    to_do: { type: JSON, default: {} },
});

const userDB = mongoose.model("userDB", schme);

module.exports = userDB;