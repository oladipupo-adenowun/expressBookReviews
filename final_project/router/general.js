const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  if('username' in req.body && 'password' in req.body){
    const username = req.body.username;
    const password = req.body.password;

    if(username === ""){
      res.send("Please provide a username");
    }

    if(password === ""){
      res.send("Please provide a password");
    }

    let userFilter = users.filter((user)=>user.username === username);
    if(userFilter.length > 0){
      res.send("User already exist");
    }

    if(username !== "" && password != "" && userFilter == 0){
      users.push({
        "username":username,
        "password":password
      });
      res.send(`User ${username} created successfully!`);
    }
  }else{
    res.send("Please provide Username and Password to register!");
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   // Send a JSON response containing the users array, formatted with an indentation of 4 spaces for readability
   let promise = new Promise((resolve, reject)=>{
    resolve(res.send(JSON.stringify({books}, null, 4)));
    reject();
   });

   promise.then((success)=>{
    console.log(`SUCCESS!: ${success}`);
   },
  (error)=>{
    console.log(`ERROR!: ${error}`);
    res.send("{Unable to send list of books}")
   });  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let promise = new Promise((resolve, reject)=>{
    const isbn = req.params.isbn;
    resolve(res.send(books[isbn]));
    reject();
   });

   promise.then(
    (success)=>{
    console.log(`SUCCESS!: ${success}`);
    },
    (error)=>{
    console.log(`ERROR!: ${error}`);
    res.send("Unable to send book");
    });  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let promise = new Promise((resolve, reject)=>{
    const author = req.params.author;
    const bookIsbns = Object.keys(books);
    const book = [];
    bookIsbns.forEach((id)=>{
      if(books[id].author === author){
        book.push(books[id]);
      }
    });
    resolve(res.send(book));
    reject();
   });

   promise.then((success)=>{
    console.log(`SUCCESS!: ${success}`);
   },
   (error)=>{
    console.log(`ERROR!: ${error}`);
    res.send(`Book NOT found!`);
   });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let promise = new Promise((resolve, reject)=>{
    const title = req.params.title;
    const bookIsbns = Object.keys(books);
    const book = [];
    bookIsbns.forEach((id)=>{
      if(books[id].title === title){
        book.push(books[id]);
      }
    });
    resolve(res.send(book));
    reject();
   });

   promise.then((success)=>{
    console.log(`SUCCESS!: ${success}`);
   },
   (error)=>{
    console.log(`ERROR!: ${error}`);
    res.send(`Book NOT found!`)
   });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
