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

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategory = await Category.find().sort({ name: 1 }).exec();
	res.render("category_list", {
		title: "Category List",
		category_list: allCategory,
	});
});

// Display details of items from a specific Categories.
exports.category_detail = asyncHandler(async (req, res, next) => {
	const [category, allItemsInCategory] = await Promise.all([Category.findById(req.params.id).exec(), Item.find({ category: req.params.id }, "name price image number_in_stock").exec()]);

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

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
	res.render("category_form", {
		title: "Create Category",
	});
});

// Handle Category create on POST.
exports.category_create_post = [
	// Validate and sanitize fields.
	body("category_name", "Invalid name").trim().isLength({ min: 1 }).escape(),
	body("category_description", "Invalid description").trim().notEmpty().isLength({ max: 200 }).withMessage("Category description's length must be less than 200 characters").escape(),

	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create Category Object with escaped and trimmed data
		const category = new Category({
			name: req.body.category_name,
			description: req.body.category_description,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.render("category_form", {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			});
		} else {
			// Save category.
			await category.save();
			// Redirect to new category record
			res.redirect(category.url);
		}
	}),
];

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();

	if (category === null) {
		// No results.
		const err = new Error("Category not found");
		err.status = 404;
		return next(err);
	}
	res.render("category_form", {
		title: "Update Category",
		category: category,
	});
});

// Display Category update form on POST.
exports.category_update_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();

	if (category === null) {
		// No results.
		const err = new Error("Category not found");
		err.status = 404;
		return next(err);
	}
	res.render("category_form", {
		title: "Update Category",
		category: category,
	});
});

// Handle POST request from category form
exports.category_update_post = [
	// Validate and sanitize fields.
	body("category_name", "Invalid name").trim().notEmpty().escape(),
	body("category_description", "Invalid description").trim().notEmpty().isLength({ max: 200 }).withMessage("Category description's length must be less than 200 characters").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		// Create a category object with escaped/trimmed data and old id.
		const category = new Category({
			name: req.body.category_name,
			description: req.body.category_description,
			_id: req.params.id, // This is required, or a new ID will be assigned!
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render("category_form", {
				title: "Update Category",
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			await Category.findByIdAndUpdate(req.params.id, category).exec();
			res.redirect(category.url);
		}
	}),
];

// Handle Category Delete on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	const [category, category_items] = await Promise.all([Category.findById(req.params.id, "name").exec(), Item.find({ category: req.params.id }).exec()]);
	res.render("category_delete", {
		title: "Delete Category",
		category: category,
		items: category_items,
	});
});

// Handle Category Delete on POST.
exports.category_delete_post = [
	// Validate and sanitize fields.
	body("password", "Password is Required").trim().notEmpty().escape(),

	asyncHandler(async (req, res, next) => {
		const [category, category_items] = await Promise.all([Category.findById(req.params.id, "name").exec(), Item.find({ category: req.params.id }).exec()]);

		// Category has items, rerender page showing items that needs to be deleted.
		if (category_items.length > 0) {
			res.render("category_delete", {
				title: "Delete Category",
				category: category,
				items: category_items,
			});
		} else {
			if (req.body.password !== process.env.Secret_PASS) {
				// Password is not correct. Render form again.
				res.render("category_delete", {
					title: "Delete Category",
					category: category,
					items: category_items,
					password_error: "ACCESS DENIED, TRY AGAIN!",
				});
			} else {
				// Category has no items, delete the object.
				await Category.findByIdAndDelete(req.params.id);
				res.redirect("/inventory/categories");
			}
		}
	}),
];
