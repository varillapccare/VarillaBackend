const mongoose = require("mongoose");

const phoneSchema = mongoose.Schema({
  phone: String,
});

exports.Phone = mongoose.model("Phone", phoneSchema);
