const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

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
	body("item_name").trim().notEmpty().withMessage("Item name is required").isLength({ min: 2 }).withMessage("Item name's minimum length is 2").escape(),
	body("item_description").trim().notEmpty().withMessage("Item description is required").isLength({ max: 300 }).withMessage("Item description's length must be less than 300 characters").escape(),
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
			image: req.file ? req.file.filename : 'bongo-cat.jpeg',
		});

		if (!errors.isEmpty()) {
			const category_list = await Category.find({}).exec();
			res.render("item_form", {
				title: "Create Item",
				item: item,
				categories: category_list,
				errors: errors.array(),
			});
		} else {
			await item.save();
			res.redirect(item.url);
		}
	}),
];

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
	const [item, category_list] = await Promise.all([Item.findById(req.params.id).exec(), Category.find({}).exec()]);

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

// Handle POST request from category form
exports.item_update_post = [
	// Validate and sanitize fields.
	body("item_name").trim().notEmpty().withMessage("Item name is required").isLength({ min: 2 }).withMessage("Item minimum length is 2").escape(),
	body("item_description").trim().notEmpty().withMessage("Item description is required").isLength({ max: 300 }).withMessage("Item description's length must be less than 300 characters").escape(),
	body("item_category").trim().notEmpty().withMessage("Item category is required").escape(),
	body("item_price").trim().notEmpty().withMessage("Item price is required").isNumeric().withMessage("Item price must be a number").escape(),
	body("item_num_in_stock").trim().notEmpty().withMessage("Number in stock is required").isInt({ min: 1 }).withMessage("Number in stock must be greater than zero").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const category_list = await Category.find({}).exec();

		// Create a item object with escaped/trimmed data and old id.
		const item = new Item({
			name: req.body.item_name,
			description: req.body.item_description,
			category: req.body.item_category,
			price: req.body.item_price,
			number_in_stock: req.body.item_num_in_stock,
			image: req.file ? req.file.filename : 'bongo-cat.jpeg',
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render("item_form", {
				title: "Update Item",
				categories: category_list,
				item: item,
				errors: errors.array(),
			});
			return;
		} else {
			// Remove the image from the public/upload folder
			const currItem = await Item.findById(req.params.id).exec();
			if (currItem.image !== "bongo-cat.jpeg") {
				fs.unlink(`public/uploads/${currItem.image}`, (err) => {
					if (err) {
						console.error(`Error deleting image file: ${err}`);
					}
				});
			}
			// Update the item object in the database
			await Item.findByIdAndUpdate(req.params.id, item).exec();
			res.redirect(item.url);
		}
	}),
];

// Handle Item Delete on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
	const item = await Item.findById(req.params.id, "name").exec();

	if (item === null) {
		// No results.
		res.redirect("/items");
	}

	res.render("item_delete", {
		title: "Delete Item",
		item: item,
	});
});

// Handle Item Delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
	// Remove the image from the public/upload folder
	const currItem = await Item.findById(req.params.id).exec();
	if (currItem.image !== "bongo-cat.jpeg") {
		fs.unlink(`public/uploads/${currItem.image}`, (err) => {
			if (err) {
				console.error(`Error deleting image file: ${err}`);
			}
		});
	}
	await Item.findByIdAndDelete(req.params.id);
	res.redirect("/inventory/items");
});
