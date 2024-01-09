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

exports.category_create_get = asyncHandler(async (req, res, next) => {
	res.render("category_form", {
		title: "Create Category",
	});
});

exports.category_create_post = [
	// Validate and sanitize fields.
	body("category_name", "Invalid name").trim().isLength({ min: 1 }).escape(),
	body("category_description", "Invalid description").trim().isLength({ min: 10 }).escape(),

	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create Category Object with escaped and trimmed data
		const category = new Category({
			name: req.body.category_name,
			description: req.body.category_description,
		})

		if(!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render('category_form', {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			})
		} else {
			// Save category.
			await category.save();
			// Redirect to new category record
			res.redirect(category.url);
		}
	}),
];

exports.category_create_post;
