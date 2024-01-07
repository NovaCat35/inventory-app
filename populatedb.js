#! /usr/bin/env node

console.log('This script populates some test items and category to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_application?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const categoriesList = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log("Debug: About to connect");
	await mongoose.connect(mongoDB);
	console.log("Debug: Should be connected?");
	await createCategories();
	await createItems();
	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Electronics, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
	const category = new Category({ name: name, description: description });
	await category.save();
	categoriesList[index] = category;
	console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, category, price, num_in_stock) {
   const item = new Item({name: name, description: description, category: category, price: price, number_in_stock: num_in_stock});
   await item.save();
   console.log(`Added item: ${name}`);
}

async function createCategories() {
	console.log("Adding categories");
	await Promise.all([
      categoryCreate(0, "Electronics", "Gadgets and electronic devices."),
      categoryCreate(1, "Furniture", "Home and office furniture."), 
      categoryCreate(2, "Books", "Various genres of books."), 
      categoryCreate(3, "Games/Toys", "Fun and entertaining games and toys for all ages."),
   ]);
}
 
async function createItems() {
   console.log("Adding items");
   const itemsData = [
       {
           name: "Smart TV",
           description: "4K Ultra HD Smart LED TV",
           category: categoriesList[0], // Electronics
           price: 799.99,
           numInStock: 10,
       },
       {
           name: "Laptop",
           description: "High-performance laptop with SSD",
           category: categoriesList[0], // Electronics
           price: 1299.99,
           numInStock: 20,
       },
       {
           name: "Sofa Set",
           description: "Modern sectional sofa set",
           category: categoriesList[1], // Furniture
           price: 1499.99,
           numInStock: 5,
       },
       {
           name: "Dining Table",
           description: "Wooden dining table with chairs",
           category: categoriesList[1], // Furniture
           price: 799.99,
           numInStock: 15,
       },
       {
           name: "The Great Gatsby",
           description: "Classic novel by F. Scott Fitzgerald",
           category: categoriesList[2], // Books
           price: 12.99,
           numInStock: 30,
       },
       {
           name: "Programming in JavaScript",
           description: "Comprehensive guide to JavaScript programming",
           category: categoriesList[2], // Books
           price: 29.99,
           numInStock: 25,
       },
       {
           name: "Board Game - Settlers of Catan",
           description: "Strategy board game for family and friends",
           category: categoriesList[3], // Games/Toys
           price: 39.99,
           numInStock: 12,
       },
       {
           name: "Action Figure - Superhero",
           description: "Collectible superhero action figure",
           category: categoriesList[3], // Games/Toys
           price: 19.99,
           numInStock: 50,
       },
   ];

   const itemPromises = itemsData.map(async (item) => {
       await itemCreate(item.name, item.description, item.category, item.price, item.numInStock);
   });

   await Promise.all(itemPromises);
   console.log("Added items");
}

