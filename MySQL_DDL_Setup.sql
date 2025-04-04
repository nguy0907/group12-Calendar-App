-- DROP DATABASE CalendarApp;  -- use if you wish to delete and restart
CREATE DATABASE IF NOT EXISTS CalendarApp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE CalendarApp;

DROP USER IF EXISTS 'primary'@'%';

CREATE USER 'primary'@'%' IDENTIFIED BY '12345';

GRANT ALL PRIVILEGES ON *.* TO 'primary'@'%'
WITH GRANT OPTION;

FLUSH PRIVILEGES;


-- DROP TABLE Users;  -- use if want to change the table
 CREATE TABLE IF NOT EXISTS Users (
 	UserID int NOT NULL AUTO_INCREMENT,
    -- Name varchar(65) NOT NULL UNIQUE,
    UserName varchar(45) NOT NULL UNIQUE,
	Email varchar(65) NOT NULL UNIQUE,
    Password varchar(45) NOT NULL,
	PRIMARY KEY (UserID)
 );
 
  -- DROP TABLE SocialPosts;  -- use if want to change the table
 CREATE TABLE IF NOT EXISTS SocialPosts (
 	SPID int NOT NULL AUTO_INCREMENT,
    AuthorID int NOT NULL,
	PostTitle varchar(65) NOT NULL,
    PostContent varchar(600) NOT NULL,
    DateCreated datetime NOT NULL, -- YYYY-MM-DD format with time HH:MI:SS
    -- TimeCreated time not null,
	PRIMARY KEY (SPID),
    CONSTRAINT AuthorID FOREIGN KEY (AuthorID) REFERENCES Users(UserID)
 );
 
 -- DROP TABLE CalendarTasks;  -- use if want to change the table
 CREATE TABLE IF NOT EXISTS CalendarTasks (
 	CTID int NOT NULL AUTO_INCREMENT,
	AuthorID int NOT NULL,
    Title varchar(65) NOT NULL,
    Description varchar(600) NOT NULL,
    Date datetime NOT NULL, -- YYYY-MM-DD format with time HH:MI:SS
    -- Time time not null,
	PRIMARY KEY (CTID),
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID)
    );
 