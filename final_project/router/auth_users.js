const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => users.filter((user) => user.username === username).length > 0;

const authenticatedUser = (username, password) => users.filter((user) => user.username === username && user.password === password).length > 0;

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("entering login router")
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  if(!review) {
    res.send("Review is required");
  }
  if(isbn > 0 && isbn < 11) {
    books[isbn].review.push(review);
    res.send("Review is added succesfully, old one is replaced");
  }
  res.send("something went wrong");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
