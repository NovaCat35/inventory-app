const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Item.
exports.item_list = asyncHandler(async (req, res, next) => {
	const allItems = await Item.find().populate("category").sort({ name: 1 }).exec();
	res.render("item_list", {
		title: "All Items",
		item_list: allItems,
	});
});

// Display details of a specific item.
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

// Handle Item create on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
	const category_list = await Category.find({}).exec();
	res.render("item_form", {
		title: "Create Item",
		categories: category_list,
	});
});

// Handle Item create on POST.
exports.item_create_post = [
	// Validate and sanitize fields.
	body("item_name").trim().notEmpty().withMessage("Item name is required").escape(),
	body("item_description").trim().notEmpty().withMessage("Item description is required").escape(),
	body("item_category").trim().notEmpty().withMessage("Item category is required").escape(),
	body("item_price").trim().notEmpty().withMessage("Item price is required").isNumeric().withMessage("Item price must be a number").escape(),
	body("item_num_in_stock").trim().notEmpty().withMessage("Number in stock is required").isInt({ min: 1 }).withMessage("Number in stock must be greater than zero").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const item = new Item({
			name: req.body.item_name,
			description: req.body.item_description,
			category: req.body.item_category,
			price: req.body.item_price,
			number_in_stock: req.body.item_num_in_stock,
		});

		if (!errors.isEmpty()) {
			const category_list = await Category.find({}).exec();
			res.render("item_form", {
				title: "Create Item",
				item: item,
				categories: category_list,
			});
		} else {
			await item.save();
			res.redirect(item.url);
		}
	}),
];

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id).exec();
	const category_list = await Category.find({}).exec();

	if (item === null) {
		// No results.
		const err = new Error("Category not found");
		err.status = 404;
		return next(err);
	}
	res.render("item_form", {
		title: "Update Item",
		categories: category_list,
		item: item,
	});
});

// Display Item update form on POST.
