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


