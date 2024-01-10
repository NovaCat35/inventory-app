const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");


/** CATEGORY ROUTES **/
// GET home page.
router.get("/", category_controller.index);

// GET request for category list.
router.get("/categories", category_controller.category_list);

// GET request for creating category
router.get("/categories/create", category_controller.category_create_get);

// POST request for creating category
router.post("/categories/create", category_controller.category_create_post);

// GET request for updating category
router.get("/categories/:id/update", category_controller.category_update_get);

// POST request for updating category
router.post("/categories/:id/update", category_controller.category_update_post);

// GET request for one category. (~ NOTE: you must put this last so the url doesn't confuse regular /url with :id !!!!!!)
router.get("/categories/:id", category_controller.category_detail);

/** ITEM ROUTES **/
// GET request for item list.
router.get("/items", item_controller.item_list);

// GET request for creating item
router.get("/items/create", item_controller.item_create_get);

// POST request for creating item
router.post("/items/create", item_controller.item_create_post);

// GET request for updating item
router.get("/items/:id/update", item_controller.item_update_get);

// POST request for updating item
router.post("/items/:id/update", item_controller.item_update_post);

// GET request for one item. (~ NOTE: you must put this last so the url doesn't confuse regular /url with :id !!!!!!)
router.get("/items/:id", item_controller.item_detail);



module.exports = router;
