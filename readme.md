# Inventory Cat Cafe
Welcome to my inventory app! This project is created to showcase dynamic site operations for adding, updating, and keeping track of objects in database. As I build up the project, I had fun creating a bit of puzzle for users to solve should they wish to obtain the password. Did I mention there's cats involved?  

⚠️ To protect against destructive actions, there is a password for updating and deleting objects. It's no fun if I just tell you the password, but perhaps you can find the answer deep within this web.

Link: https://inventory-cat-cafe.fly.dev 🐈 ☕️

-----
# Features 🎯
- ALL CRUD operations for uploading categories and items 
- Ability to upload images
- Safeguard for uploading/deleting objects
- Cats!

## Technologies Used 🚀
- **Backend:** Node.js, Express.js
- **Stylesheet Language:** SCSS
- **View Engine:** EJS
- **Database:** MongoDB
- **Image Hosting:** Cloudinary

## Hosting Platforms 🌐
- [fly.io](https://fly.io): for deploying and hosting the application
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): for cloud-based MongoDB hosting
- [Cloudinary](https://cloudinary.com): for hosting and managing images


## Learning & Challenges 🔥
Some of the key learning points for this project involved CRUD operations, file upload/multipart forms, and getting it all set up on Cloudinary and production environment.

One of the earlier issues I ran into was dealing with 404 and 500 pages because I wasn't aware of key components of how routes, controllers, and EJS handle some values and paths as I imagined. Through trial and error with testing out different routes and configurations using libraries, I managed to get everything working. Another issue I tackled was originally the changes I made to my model after incorporating images and other changes for forms. I believe I took some valuable lessons in using models and what is good and bad habits dealing with forms as well as file uploads. Pretty much for other problems, after the first breakthrough, everything else came more naturally. 

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
npm install cloudinary
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
> Reminder to change env variables(within host provider) & set node version in our package.json & NODE_ENV = "production"


