create database library;
use library;

create table books (
		id_book int not null auto_increment,
        book_name varchar(50),
        isbn13 varchar(17) UNIQUE,
        id_author int,
        constraint pk_books primary key(id_book),
        constraint fk_books_author foreign key(id_author) references authors(id_author) ON DELETE CASCADE
) ;

create table authors (
		id_author int not null auto_increment,
        author_name varchar(50),
        nationality varchar(50),
        constraint pk_authors primary key(id_author)
) ;


SELECT id_book, book_name, isbn13, a.id_author, a.author_name, a.nationality FROM books as b INNER JOIN authors as a ON b.id_author = a.id_author WHERE id_book = 1;

SELECT book_name, isbn13, id_author FROM books WHERE id_book = 1;
INSERT INTO authors (author_name, nationality) VALUES ('Antonio Santa Ana', 'Argentina');
INSERT INTO books (book_name, isbn13, id_author) VALUES ('Los ojos del perro siberiano', '978-987-545-706-4', '2');
DELETE FROM books WHERE id_book = 1 LIMIT 1;
select * from authors
drop table books;