create database library;
use library;

create table books (
		id_book int not null auto_increment,
        book_name varchar(50),
        isbn13 varchar(17) UNIQUE,
        author varchar(50),
        constraint pk_books primary key(id_book)
) ;


SELECT * FROM books;
SELECT book_name, isbn13, author FROM books WHERE id_book = 1;
INSERT INTO books (book_name, isbn13, author) VALUES ('Los ojos del perro siberiano', '978-987-545-706-5', 'Antonio Santa Ana');
DELETE FROM books WHERE id_book = 1 LIMIT 1;