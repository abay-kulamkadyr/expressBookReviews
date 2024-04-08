const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login. User is "+username});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    let isbn = req.params.isbn;
    if(isbn > 0 && isbn < 10)
      res.send(JSON.stringify(books[isbn])); 
    res.send("A book with the given isbn doesn't exit")
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author_name = req.params.author; 
  let filtered_books = [];
  for(let key in books) {
      if(books[key].author === author_name) {
          filtered_books.push(books[key]);
      }
  } 

  if(filtered_books.length <= 0)
    res.send("Couldn't find a book by author: "+author_name);
  res.send(JSON.stringify(filtered_books, null, 4));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let book_title = req.params.title;
  let found_books = [];

  for(let key in books) {
      if(books[key].title === book_title) {
        found_books.push(books[key]);
      }
  }
  if(found_books.length <= 0) {
    res.send("Couldn't find a book with the title: "+ book_title);
  }
  res.send(JSON.stringify(found_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(isbn > 0 && isbn < 11)
    res.send(JSON.stringify(books[isbn].reviews));
  res.send("A book with the given ISBN doesn't exist")
});

module.exports.general = public_users;
