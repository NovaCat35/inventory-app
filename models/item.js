const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const ItemSchema = Schema({
	name: { type: String, required: true, minLength: 3 },
	description: { type: String, required: true, maxLength: 400 },
	category: {type: Schema.Types.ObjectId, ref: "Category", required: true },
	price: { type: Number, required: true },
	number_in_stock: Number,
});

ItemSchema.virtual("url").get(function () {
	return `/inventory/items/${this._id}`;
});

// Export Model
module.exports = mongoose.model("Item", ItemSchema);