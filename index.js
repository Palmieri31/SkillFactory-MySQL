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
      const books = result.map((book) => ({
        id_book: book.id_book,
        book_name: book.book_name,
        isbn13: book.isbn13,
        author: {
          id_author: book.id_author,
          author_name: book.author_name,
          nationality: book.nationality,
        },
      }));
      res.status(200).json(books);
    }
  });
});

app.get('/book/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT id_book, book_name, isbn13, a.id_author, a.author_name, a.nationality FROM books as b INNER JOIN authors as a ON b.id_author = a.id_author WHERE id_book = ? LIMIT 1', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      const books = result.map((book) => ({
        id_book: book.id_book,
        book_name: book.book_name,
        isbn13: book.isbn13,
        author: {
          id_author: book.id_author,
          author_name: book.author_name,
          nationality: book.nationality,
        },
      }));
      res.status(200).json(books);
    }
  });
});

app.post('/book', (req, res) => {
  const { bookName, isbn13, authorId } = req.body;
  if (!bookName || !isbn13 || !authorId) {
    res.status(400).json({ message: 'complete the requested fields' });
    return;
  }
  connection.query('INSERT INTO books (book_name, isbn13, id_author) VALUES (?, ?, ?)', [bookName, isbn13, authorId], (err) => {
    if (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(500).json({ message: 'The requested author was not found' });
      } else if (err.code === 'ER_DUP_ENTRY') {
        res.status(500).json({ message: 'Duplicate isbn13' });
      } else {
        res.status(500).json({ message: 'database error' });
      }
    } else {
      res.status(200).json({ message: 'the book was added successfully!' });
    }
  });
});

app.put('/book/:id', (req, res) => {
  const { id } = req.params;
  const { bookName, isbn13, authorId } = req.body;
  if (!bookName || !isbn13 || !authorId) {
    res.status(400).json({ message: 'complete the requested fields' });
    return;
  }

  connection.query('UPDATE books SET book_name = ?, isbn13 = ?, id_author = ? WHERE id_book = ? LIMIT 1', [bookName, isbn13, authorId, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(500).json({ message: 'The requested author was not found' });
      } else if (err.code === 'ER_DUP_ENTRY') {
        res.status(500).json({ message: 'Duplicate isbn13' });
      } else {
        res.status(500).json({ message: 'database error' });
      }
    } else if (!result.affectedRows) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      console.log(result);
      res.status(200).json({ message: 'he book was successfully edited!' });
    }
  });
});

app.delete('/book/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM books WHERE id_book = ? LIMIT 1;', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.affectedRows) {
      res.status(404).json({ message: 'The requested book was not found' });
    } else {
      res.status(200).json({ message: 'The book was successfully removed!' });
    }
  });
});

app.get('/authors', (req, res) => {
  connection.query('SELECT id_author, author_name, nationality  FROM authors', (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'no authors found' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/author/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM authors  WHERE id_author = ? LIMIT 1', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.length) {
      res.status(404).json({ message: 'The requested author was not found' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/author', (req, res) => {
  const { authorName, nationality } = req.body;
  if (!authorName || !nationality) {
    res.status(400).json({ message: 'complete the requested fields' });
    return;
  }
  connection.query('INSERT INTO authors (author_name, nationality) VALUES (?, ?)', [authorName, nationality], (err) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else {
      res.status(200).json({ message: 'the author was added successfully!' });
    }
  });
});

app.put('/author/:id', (req, res) => {
  const { id } = req.params;
  const { authorName, nationality } = req.body;
  if (!authorName || !nationality) {
    res.status(400).json({ message: 'complete the requested fields' });
    return;
  }
  connection.query('UPDATE authors SET author_name = ?, nationality = ? WHERE id_author = ? LIMIT 1', [authorName, nationality, id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'database error' });
    } else if (!result.affectedRows) {
      res.status(404).json({ message: 'The requested author was not found' });
    } else {
      res.status(200).json({ message: 'he author was successfully edited!' });
    }
  });
});

app.listen(port, () => {
  console.log('Server listen on port', port);
});
