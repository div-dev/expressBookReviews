const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  console.log(users);
  return res.status(201).json({ message: "User registered successfully" });
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if(book){
    return res.status(200).json(books[isbn]);
  }else{
    return res.status(404).json({message:"book not found"})
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if(filteredBooks.length>0){
    return res.status(200).json(filteredBooks);
  }else{
    return res.status(404).json({message:"Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase()===title)
  if(filteredBooks.length>0){
    return res.status(200).json(filteredBooks);
  }else{
    return res.status(404).json({message:"Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    if (Object.keys(books[isbn].reviews).length > 0) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(200).json({ message: "No reviews for this book" });
    }
} else {
    return res.status(404).json({ message: "Book not found" });
}
});

module.exports.general = public_users;
