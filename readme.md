# Inventory Application
A inventory app to keep track of desired wish list [Work in progress...]

# Features 🎯

## Tools and Tech 🛠️
- Node.js, Express.js, SCSS

## Challenges
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
npm install luxon
npm install node-sass-middleware --save
npm install express sass
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


