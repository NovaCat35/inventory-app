const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const ItemSchema = Schema({
	name: { type: String, required: true, minLength: 2 },
	description: { type: String, required: true, maxLength: 300 },
	category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
	profile_img: String,
	cloudinary_id: String,
	price: { type: Schema.Types.Decimal128, required: true },
	number_in_stock: {type: Number, required: true},
});

ItemSchema.virtual("url").get(function () {
	return `/inventory/items/${this._id}`;
});

// Export Model
module.exports = mongoose.model("Item", ItemSchema);
