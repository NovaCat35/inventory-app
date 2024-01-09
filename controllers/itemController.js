const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.item_list = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find().populate("category").sort({ name: 1 }).exec();
	res.render("item_list", {
		title: "All Items",
		item_list: allItems,
	});
});

exports.item_detail = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).populate("category").exec();

	if (item == null) {
		// No results.
		const err = new Error();
		err.status = 404;
		return next(err);
	}

	// Get details of item
	res.render("item_detail", {
		title: "Item Detail",
		item: item,
	});
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
	const category_list = await Category.find({}).exec();
	res.render("item_form", {
		title: "Create Item",
		categories: category_list,
	});
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
	const category_list = await Category.find({}).exec();
	res.render("item_form", {
		title: "Create Item",
		categories: category_list,
	});
});
