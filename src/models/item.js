const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const ItemSchema = Schema({
	name: { type: String, required: true, minLength: 2 },
	description: { type: String, required: true, maxLength: 300 },
	category: {type: Schema.Types.ObjectId, ref: "Category", required: true },
	image: { type: String, default: 'bongo-cat.jpeg' }, 
	price: { type: Schema.Types.Decimal128, required: true },
	number_in_stock: Number,
});

ItemSchema.virtual("url").get(function () {
	return `/inventory/items/${this._id}`;
});

// Export Model
module.exports = mongoose.model("Item", ItemSchema);
