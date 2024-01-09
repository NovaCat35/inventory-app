const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

// GET home page.
router.get("/", category_controller.index);

// GET request for category list.
router.get("/categories", category_controller.category_list);

// GET request for one category.
router.get("/categories/:id", category_controller.category_detail);

// GET request for creating category
router.get("/category/create", category_controller.category_create);

// GET request for item list.
router.get("/items", item_controller.item_list);

// GET request for one item.
router.get("/items/:id", item_controller.item_detail);

// GET request for creating category
router.get("/item/create", item_controller.item_create);
module.exports = router;
