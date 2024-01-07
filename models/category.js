const mongoose = require("mongoose");

// Create Schema
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
   name: {type: String, required: true},
   description: {type: String, required: true, maxLength: 100 },
})

CategorySchema.virtual('url').get(function () {
   return `/category/${this._id}`;
})

// Export model
module.exports = mongoose.model("Category", CategorySchema);