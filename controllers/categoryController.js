const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Get details of current number of categories and items
exports.index = asyncHandler(async (req, res, next) => {
	const [allCategories, allItems] = await Promise.all([Category.find({}).exec(), Item.find({}).exec()]);
	res.render("index", {
		title: "My Inventory App",
		categories: allCategories,
		items: allItems,
	});
});

exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategory = await Category.find().sort({ name: 1 }).exec();
	res.render("category_list", {
		title: "Category List",
		category_list: allCategory,
	});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
	const [category, allItemsInCategory] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({ category: req.params.id }, "name price number_in_stock").exec()]);

	if (category == null) {
		// No results.
		const err = new Error();
		err.status = 404;
		return next(err);
	}

	// Get details of item
	res.render("category_detail", {
		title: "Category Detail",
		category: category,
		category_items: allItemsInCategory,
	});
});

exports.category_create = asyncHandler(async (req, res, next) => {
	res.render("category_form", {
		title: "Create Category",
	});
});
