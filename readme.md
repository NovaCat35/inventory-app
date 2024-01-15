# The Modern 90s Inventory Web 
Welcome to my inventory website! This project is to mainly enforce and showcase what I learned so far to create dynamic site operations for adding, updating, and keeping track of objects in database. 

Note: To protect against destructive actions, there is a password for updating and deleting objects. You ain't getting that from me, but perhaps the answer lies deep within this web.

💡Pro-Tip: Did you know you can click and drag to highlight elements on the web? Cool stuff!

[Work in progress...] 

# Features 🎯
- ALL CRUD operations for uploading categories and items 
- Ability to upload images (multer library)
- Cats...

## Tools and Tech 🛠️
- Node.js, Express.js, SCSS, MongoDB, EJS

## Challenges 🔥
Running into 404 and 500 pages sometimes as I change the routes and some code as more requirements popped up as I continue to handle get and post forms. The tough part is managing error occurrences in routes, controllers, and views.

## --- EXPRESS INSTALLATION 🚂 ---
### DEVELOPMENT 
> Type in terminal the following : 
``` 
express inventory-application --view=ejs --css=sass
cd inventory-application
npm install 
npm install --save-dev nodemon
npm install dotenv --save
npm install mongoose
npm install express-async-handler
npm install express-validator
npm install node-sass-middleware --save
npm install express sass
npm install --save multer
npm install luxon <UNUSED, this is for future reference for date library>
```

> Reminder to check app.js for all added changes 

### PRODUCTION
> Type in terminal the following : 
```
npm install compression
npm install helmet
npm install express-rate-limit
```
> Reminder to change env variables(within host provider) & set node version in our package.json 


