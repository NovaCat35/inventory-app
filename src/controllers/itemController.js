const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const cloudinary = require("../configs/cloudinaryConfig");
require("dotenv").config();

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
		try {
			const errors = validationResult(req);
			let formattedPrice = parseFloat(req.body.item_price).toFixed(2);

			let item;

			// Check if a file is uploaded
			if (req.file) {
				// Upload image to cloudinary
				const result = await cloudinary.uploader.upload(req.file.path, { folder: "cat_inventory" });

				item = new Item({
					name: req.body.item_name,
					description: req.body.item_description,
					category: req.body.item_category,
					price: formattedPrice,
					number_in_stock: req.body.item_num_in_stock,
					profile_img: result.secure_url,
					cloudinary_id: result.public_id,
				});
			} else {
				// If no file uploaded, create item without image
				item = new Item({
					name: req.body.item_name,
					description: req.body.item_description,
					category: req.body.item_category,
					price: formattedPrice,
					number_in_stock: req.body.item_num_in_stock,
				});
			}

			// Replace special encoded characters in item name and description
			item.name = replaceEncodedCharacters(item.name);
			item.description = replaceEncodedCharacters(item.description);

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.
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
		} catch (err) {
			console.log(err);
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
		password_required: true,
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
		try {
			const errors = validationResult(req);
			const category_list = await Category.find({}).exec();
			let formattedPrice = parseFloat(req.body.item_price).toFixed(2);

			let item;

			// Check if a file is uploaded
			if (req.file) {
				// Upload image to cloudinary
				const result = await cloudinary.uploader.upload(req.file.path, { folder: "cat_inventory" });

				item = new Item({
					name: req.body.item_name,
					description: req.body.item_description,
					category: req.body.item_category,
					price: formattedPrice,
					number_in_stock: req.body.item_num_in_stock,
					profile_img: result.secure_url,
					cloudinary_id: result.public_id,
					_id: req.params.id, // This is required, or a new ID will be assigned!
				});
			} else {
				// If no file uploaded, create item without image
				item = new Item({
					name: req.body.item_name,
					description: req.body.item_description,
					category: req.body.item_category,
					price: formattedPrice,
					number_in_stock: req.body.item_num_in_stock,
					_id: req.params.id,
				});
			}
			// Replace special encoded characters in item name and description
			item.name = replaceEncodedCharacters(item.name);
			item.description = replaceEncodedCharacters(item.description);

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.
				res.render("item_form", {
					title: "Update Item",
					categories: category_list,
					item: item,
					password_required: true,
					errors: errors.array(),
				});
				return;
			} else {
				if (req.body.password !== process.env.Secret_PASS) {
					// Password is not correct. Render form again.
					res.render("item_form", {
						title: "Update Item",
						categories: category_list,
						item: item,
						password_required: true,
						password_error: "ACCESS DENIED, TRY AGAIN!",
					});
				} else {
					// Update the item object in the database (NOTE: updatedItem == the old item)
					const updatedItem = await Item.findByIdAndUpdate(req.params.id, item).exec();
					// If user has a cloudinary_id, delete old image from cloudinary
					if (updatedItem && updatedItem.cloudinary_id) {
						await cloudinary.uploader.destroy(updatedItem.cloudinary_id, { folder: "cat_inventory" });
					}
					res.redirect(item.url);
				}
			}
		} catch (err) {
			console.error(err);
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
exports.item_delete_post = [
	// Validate and sanitize fields.
	body("password", "Password is Required").trim().notEmpty().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const item = await Item.findById(req.params.id, "name").exec();

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render("item_delete", {
				title: "Delete Item",
				item: item,
				errors: errors.array(),
			});
		} else {
			if (req.body.password !== process.env.Secret_PASS) {
				// Password is not correct. Render form again.
				res.render("item_delete", {
					title: "Delete Item",
					item: item,
					password_error: "ACCESS DENIED, TRY AGAIN!",
				});
			} else {
				// Update the item object in the database
				const currItem = await Item.findByIdAndDelete(req.params.id).exec();
				// If user has a cloudinary_id, delete image from cloudinary
				if (currItem && currItem.cloudinary_id) {
					await cloudinary.uploader.destroy(currItem.cloudinary_id, { folder: "cat_inventory" });
				}
				res.redirect("/inventory/items");
			}
		}
	}),
];

// Function to replace encoded characters (this may be irrelevant with using EJS <%- %>)
function replaceEncodedCharacters(input) {
	// Replace "&amp;#x2F;" and  "&#x2F;" with "/"
	input = input.replace(/&amp;#x2F;|&#x2F;/g, "/");

	// Replace "&#x27;" with single quote "'"
	input = input.replace(/&#x27;/g, "'");

	return input;
}
