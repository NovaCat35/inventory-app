# My Inventory Cat Cafe
Welcome to my inventory site! This project is created to showcase dynamic site operations for adding, updating, and keeping track of objects in database. Though initially I was just gonna make this pretty plain, I had fun creating the puzzle and mystery of the theme of mystery and early internet vibe. Did I mention there's cats involved?  

Note⚠️ To protect against destructive actions, there is a password for updating and deleting objects. It's no fun if I just tell you the password, but perhaps you can find the answer deep within this web.

Link: ☕️

-----
# Features 🎯
- ALL CRUD operations for uploading categories and items 
- Ability to upload images (multer library)
- Cats...

## Tools and Tech 🔬
- Node.js, Express.js, SCSS, MongoDB, EJS

## Challenges 🔥
Some of the earlier issues I ran into was dealing with 404 and 500 pages because I wasn't aware of key components of how routes, controllers, and ejs handle around some values and paths as I imagine. Though after the first breakthrough, everything else came more naturally. 

## Installation Guide ⚙️
### Development
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

### Production
> Type in terminal the following : 
```
npm install compression
npm install helmet
npm install express-rate-limit
```
> Reminder to change env variables(within host provider) & set node version in our package.json 


