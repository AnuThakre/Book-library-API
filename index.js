require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database

const database = require("./database/database");
//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//const { reset } = require("nodemon");

//Initialise express

const booky = express();

booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL,
    /* {
         useNewUrlParper: true,
         useUnifiedTopology: true,
         useFindAndModify: false,
         useCreateIndex: true
     }*/


).then(() => console.log("Connection established"));

/*
ROUTE        /
DESCRIPTON   Get all Books
ACCESS       PUBLIC
PARAMETER    NONE
METHOD   GET
*/

booky.get("/", async (req, res) => {

    const getAllBooks = await BookModel.find()

    return res.json(getAllBooks);

});


/*
ROUTE        /is 
DESCRIPTON   Get Specific Book on ISBN
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       GET
*/

booky.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn })

    //null !0=1 , !1=0
    if (!getSpecificBook) {
        return res.json({ error: `No book found for ISBN of ${req.params.isbn}` });

    }


    return res.json({ book: getSpecificBook });

});

/*
ROUTE        /c 
DESCRIPTON   Get Specific Book on category
ACCESS       PUBLIC
PARAMETER    category
METHOD       GET
*/

booky.get("/c/:category", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ category: req.params.category })

    //null !0=1 , !1=0
    if (!getSpecificBook) {
        return res.json({ error: `No book found for category of ${req.params.category}` });

    }


    return res.json({ book: getSpecificBook });

});

/*
ROUTE        /l
DESCRIPTON   Get Specific Book on lanuage
ACCESS       PUBLIC
PARAMETER    language
METHOD       GET
*/

booky.get("/l/:language", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ language: req.params.language })

    //null !0=1 , !1=0
    if (!getSpecificBook) {
        return res.json({ error: `No book found for language of ${req.params.language}` });

    }


    return res.json({ book: getSpecificBook });

});


/*
ROUTE        /author
DESCRIPTON   Get all authors
ACCESS       PUBLIC
PARAMETER    NONE
METHOD       GET
*/

booky.get("/author", async (req, res) => {

    const getAllAuthors = await AuthorModel.find()

    return res.json(getAllAuthors);

});

/*
ROUTE        /author
DESCRIPTON   Get authors based on id
ACCESS       PUBLIC
PARAMETER    id
METHOD       GET
*/

booky.get("/author/:id", async (req, res) => {

    const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.id });

    if (!getSpecificAuthor) {

        return res.json({ error: `No author found for id ${req.params.id}` })
    }

    return res.json({ author: getSpecificAuthor });

});




/*
ROUTE        /author/book
DESCRIPTON   Get all authors based on isbn
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       GET
*/

booky.get("/author/book/:isbn", async (req, res) => {

    const getSpecificAuthor = await AuthorModel.findOne({ book: req.params.book });

    if (!getSpecificAuthor) {

        return res.json({ error: `No author found for book of ${req.params.isbn}` });
    }

    return res.json({ author: getSpecificAuthor });

});


/*
ROUTE        /publication
DESCRIPTON   Get all publications
ACCESS       PUBLIC
PARAMETER    None
METHOD       GET
*/
booky.get("/publication", async (req, res) => {

    const getAllPublications = await BookModel.find()

    return res.json(getAllPublications);

});

/*
ROUTE        /publication
DESCRIPTON   Get specific publication based on id
ACCESS       PUBLIC
PARAMETER    id
METHOD       GET
*/
booky.get("/publication/:id", async (req, res) => {

    const getSpecificPublication = await PublicationModel.findOne({ id: req.params.id });

    if (!getSpecificPublication) {

        return res.json({ error: `No Publication found for id ${req.params.id}` })
    }

    return res.json({ author: getSpecificPublication });

});

/*
ROUTE        /publication
DESCRIPTON   Get specific publication based on id
ACCESS       PUBLIC
PARAMETER    id
METHOD       GET
*/

booky.get("/publication/book/:isbn", (req, res) => {

    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if (getSpecificPublication.length === 0) {

        return res.json({ error: `No Publication found for book of ${req.params.isbn}` });
    }

    return res.json({ author: getSpecificPublication });

});


//POST

/*
ROUTE        /book/new
DESCRIPTON   Add new book
ACCESS       PUBLIC
PARAMETER    None
METHOD       Post
*/

booky.post("/book/new", async (req, res) => {

    const { newBook } = req.body;
    // Destructuring

    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Book was added !!!"
    });


});

/*
ROUTE        /author/new
DESCRIPTON   Add new authors
ACCESS       PUBLIC
PARAMETER    None
METHOD       Post
*/
booky.post("/author/new", (req, res) => {

    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);

    return res.json({
        author: addNewAuthor,
        message: "Author was added!!!"
    });

});











/*

ROUTE        /publication/new
DESCRIPTON   Add new publication
ACCESS       PUBLIC
PARAMETER    None
METHOD       Post
*/

booky.post("/publication/new", (req, res) => {

    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);

    return res.json({
        publication: addNewPublication,
        message: "Publication was added!!!"
    })
});

/*
ROUTE        /publication/new
DESCRIPTON   Add new publication
ACCESS       PUBLIC
PARAMETER    None
METHOD       Post
*/

booky.post("/publication/new", (req, res) => {

    const { newPub } = req.body;

    if (!newPub.id) {
        return res.json({ error: "Publication ID is missing in the request body" });
    }

    const exisitingPub = database.publication.findOne({
        id: req.params.id
    });

    console.log("exisitingPub".exisitingPub);

    if (exisitingPub) {

        return res.json({ error: `invalid id ${req.body}` })
    }

    return res.json({ updatedPublication: newPub })


    /*

    const newPub = req.body;

    if (!newPub.id) {
        return res.json({ error: "Publication ID is missing in the request body" });
    }

    const exisitingPub = database.publication.find(publication => publication.id === newPub.id);

    console.log("exisitingPub".exisitingPub);

    if (exisitingPub) {

        return res.json({ error: `invalid id ${req.body}` })
    }

    return res.json({ updatedPublication: newPub })
    */
});

/*************put********** */


/*
ROUTE        /book/update/:isbn
DESCRIPTON   Update book on isbn
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       Put
*/


booky.put("/book/update/:isbn", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    );
    return res.json({
        books: updatedBook
    });


});

/****Updating New Author*/

/*

ROUTE        /book/author/update/:isbn
DESCRIPTON   Update of add new author
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       Put
*/
booky.put("/book/author/update/:isbn", async (req, res) => {
    //Update book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                authors: req.body.newAuthor

            }
        },
        {
            new: true
        }

    );


    //Update the author database

    const updatedAuthor = await AuthorModel.findOneAndUpdate(

        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added"
    });

});













/*
ROUTE        /publication/update/book
DESCRIPTON   Update / add new publication
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       Put
*/
booky.put("/publication/update/book/:isbn", (req, res) => {

    //update  the publication database

    database.publication.forEach((pub) => {
        if (pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }

    });

    //Update the book database 

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });
    return res.json({
        book: database.books,
        publication: database.publication,
        message: "Sucessfuly update publication"
    })

});

/*
ROUTE        /book/delete
DESCRIPTON   Delete book
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       DELETE
*/

booky.delete("/book/delete/:isbn", async (req, res) => {
    

    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: updatedBookDatabase
    });


    /* const updatedBookDatabase = database.books.filter(
         (book) => book.ISBN !== req.params.isbn
     );
 
     database.books = updatedBookDatabase;
 
     return res.json({
         books: database.books
     })
     */


});

/*
ROUTE        /book/author/delete
DESCRIPTON   Delete author from book 
ACCESS       PUBLIC
PARAMETER    isbn
METHOD       DELETE
*/
booky.delete("/book/author/delete/:isbn/:authorId",  (req, res) =>
 {
    
   
     database.books.forEach((book) =>
      {
         if (book.ISBN === req.params.isbn) {
             const newAuthorlist = book.author.filter(
                 (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
             );
             book.author = newAuthorlist;
             return;
 
         }
         
 
     });
 
     return res.json({
         books: database.books
     })


});

/*
ROUTE        /book/delete/author
DESCRIPTON   Delete author from book and vice versa
ACCESS       PUBLIC
PARAMETER    isbn,authorId
METHOD       DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorlist = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorlist;
            return;

        }

    });


    //update the author database

    database.author.forEach((eachAuthor) => {
        if (eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }

    })
    return res.json({
        books: database.books,
        author: database.author,
        message: "Sucessfully deleted author"

    });

});



booky.listen(3000, () => {
    console.log("Server is up and running");
})