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


const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        if(books) {
          resolve(books);
        } else {
          reject(new Error("No books are present in the database"));
        }
    });
};
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    let books = await getAllBooks();
    res.send(books);
  } catch(error) {
    res.send(error);
  }
});


const getBookByIsbn =  (isbn) => {
  return new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book with ISBN ${isbn} is not found"));
    }
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
    let isbn = req.params.isbn;
    try{
      let book = await getBookByIsbn(isbn);
      res.send(book);
    } catch(error) {
      return res.status(404).send(error.message);
    }
 });
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject)=>{
      let filtered_books = [];
      for(let key in books) {
          if(books[key].author === author) {
            filtered_books.push(books[key]);
          }
      }
      if(filtered_books.length <= 0) {
        reject(new Error("Couldn't find a book by autho ${author}"));
      } else {
          resolve(filtered_books);
      }
  });
} 
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let author_name = req.params.author; 
  try {
    let books = await getBooksByAuthor(author_name); 
    res.status(200).send(books);
  } catch (error) {
      res.status(404).send(error.message);
  }
});
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject)=>{
      let found_books = [];
      for(let key in books) {
        if(books[key].title === title) {
          found_books.push(books[key]);
        }
      }
      if(found_books.length <= 0) {
          reject(new Error("Couldn't find a book with the title ${title}"))
      } else {
          resolve(found_books);
      }
  });
};
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  let book_title = req.params.title;
  try {
    let books = await getBooksByTitle(book_title); 
    res.status(200).send(books);
  } catch (error) {
    res.status(404).send(error.message); 
  } 
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
