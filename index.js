const express = require('express');
const dbConnection = require('./database');

const app = express();
const port = 4000;

app.use(express.json());

const connection = dbConnection();

app.get('/books', (req, res) => {
  connection.query('SELECT * FROM books', (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'no books found' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/book/:id', (req, res) => {
  const { id } = req.params;

  connection.query(`SELECT book_name, isbn13, author FROM books WHERE id_book = ${id} LIMIT 1`, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/books', (req, res) => {
  const { bookName, isbn13, author } = req.body;

  connection.query(`INSERT INTO books (book_name, isbn13, author) VALUES ('${bookName}', '${isbn13}', '${author}')`, (err) => {
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
  const { bookName, isbn13, author } = req.body;

  connection.query(`UPDATE books SET book_name = '${bookName}', isbn13 = '${isbn13}', author = '${author}' WHERE id_book = ${id} LIMIT 1`, (err, result) => {
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
