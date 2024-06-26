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
      data: {username, password}
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
  console.log("got isbn"+isbn);
  const review_rcvd = req.body.review;
   
  console.log("got review" + review_rcvd)
  // Retrieve username from JWT token
  const username = req.user.data.username; 
  //console.log(JSON.stringify(req.user));
  console.log(username)
  if(!review_rcvd) {
    res.send("Review is required");
  }
  if(isbn > 0 && isbn < 11) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    const new_review = {user: username, review: review_rcvd};
    books[isbn].reviews[username] = new_review;
    res.send("Review is added succesfully, old one is replaced");
  }
  res.send("something went wrong");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  const username = req.user.data.username; 
  const isbn = req.params.isbn;
  if(books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.send("review has been deleted");
  }
  return res.send("review doesn't exist");
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
