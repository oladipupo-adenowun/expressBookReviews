const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
    if (!username) {
        return res.status(404).json({ message: "Username or password missing!" });
    }

    theUser = users.find((user)=>user.username === username && user.password === password);
    if(!theUser){
      return res.status(404).json({ message: "Username not found!" });
    }

    const user = {username:theUser.username};

    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.user = user;

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
    //pass user object in body to test i.e {"users":"Gameboy"}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const message = req.query.message;
  const username = req.session.user.username;
  books[isbn].reviews[username] = message;
  console.log(books);
  return res.status(200).send(`Book ${isbn} successfully reviewed`);
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const isbn = req.params.isbn;
  const username = req.session.user.username;
  delete books[isbn].reviews[username];
  console.log(books);
  return res.status(200).send(`Book ${isbn} review delete successfully`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
