const express = require('express');
const dbConnection = require('./database');

const app = express();
const port = 4000;

app.use(express.json());

const connection = dbConnection();

app.get('/books', (req, res) => {
  connection.query('SELECT id_book, book_name, isbn13, a.id_author, a.author_name, a.nationality FROM books as b INNER JOIN authors as a ON b.id_author = a.id_author', (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'no books found' });
    } else {
      const data = [];
      result.forEach((book) => data.push({
        id_book: book.id_book,
        book_name: book.book_name,
        isbn13: book.isbn13,
        author: {
          id_author: book.id_author,
          author_name: book.author_name,
          nationality: book.nationality,
        },
      }));
      res.status(200).json(data);
    }
  });
});

app.get('/book/:id', (req, res) => {
  const { id } = req.params;

  connection.query(`SELECT id_book, book_name, isbn13, a.id_author, a.author_name, a.nationality FROM books as b INNER JOIN authors as a ON b.id_author = a.id_author WHERE id_book = ${id} LIMIT 1`, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      const data = [];
      result.forEach((book) => data.push({
        id_book: book.id_book,
        book_name: book.book_name,
        isbn13: book.isbn13,
        author: {
          id_author: book.id_author,
          author_name: book.author_name,
          nationality: book.nationality,
        },
      }));
      res.status(200).json(data);
    }
  });
});

app.post('/books', (req, res) => {
  const { bookName, isbn13, authorId } = req.body;

  connection.query(`INSERT INTO books (book_name, isbn13, id_author) VALUES ('${bookName}', '${isbn13}', '${authorId}')`, (err) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
      throw err;
    } else {
      res.status(200).json({ message: 'the book was added successfully!' });
    }
  });
});

app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { bookName, isbn13, authorId } = req.body;

  connection.query(`UPDATE books SET book_name = '${bookName}', isbn13 = '${isbn13}', id_uthor = '${authorId}' WHERE id_book = ${id} LIMIT 1`, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.affectedRows) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      res.status(200).json({ message: 'he book was successfully edited!' });
    }
  });
});

app.delete('/book/:id', (req, res) => {
  const { id } = req.params;

  connection.query(`DELETE FROM books WHERE id_book = ${id} LIMIT 1;`, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.affectedRows) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      res.status(200).json({ message: 'The book was successfully removed!' });
    }
  });
});

app.listen(port, () => {
  console.log('Server listen on port', port);
});
