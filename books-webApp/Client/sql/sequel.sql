CREATE TABLE IF NOT EXISTS Users
(
  UserID CHAR(14) UNIQUE,
  UserPassword VARCHAR(255) NOT NULL,/*Use a php hash function to hash the text password*/
  JoinDate DATETIME NOT NULL, /* "YYYY-MM-DD HH:MM:SS" */
  NameAlias VARCHAR(20) UNIQUE,
  Sex ENUM('M','F') NOT NULL, /*Sex CHAR(M, F OR C for Company)*/
  DoB DATE, /*Dob			DATE*/
  Email VARCHAR(50) UNIQUE NOT NULL, /*Email addresses VARCHAR (50)*/
  Prefecture VARCHAR(20) NOT NULL,/*Prefecture CHAR(50)*/
  About TEXT,
  ProfilePic VARCHAR(255), /*uri to profile pic*/
  PrivacyBitmap VARCHAR(12),
  UnreadMessages SMALLINT UNSIGNED DEFAULT 0,
  Student BOOL DEFAULT FALSE,
  School VARCHAR(30) DEFAULT FALSE,
  PRIMARY KEY (UserID)
);
CREATE TABLE IF NOT EXISTS Books
(
  UserID CHAR(14) NOT NULL,
  BookID VARCHAR(14), /*Unique ID starting with B*/
  Title VARCHAR(50) NOT NULL, /*Comma separated list of authors*/
  Edition SMALLINT DEFAULT 1,
  Authors VARCHAR(255),
  Language VARCHAR(64),
  Description TEXT,
  Cover ENUM('paper_back', 'hard_back'),
  PageNo SMALLINT UNSIGNED DEFAULT 0,
  Publisher VARCHAR(30),
  Published INT(4) NOT NULL,
  ISBN VARCHAR(15),
  New BOOL,
  `Condition` TEXT, /*If it's used*/
  Location VARCHAR(30), /*In case of University, specify the name of the University*/
  Price MEDIUMINT UNSIGNED DEFAULT 0,
  Deliverable BOOL,
  DateAdded DATETIME NOT NULL ,
  OfferExpiry DATETIME NOT NULL,
  BookSerial SERIAL,
  PRIMARY KEY (BookID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE IF NOT EXISTS Interested
(
  InterID VARCHAR(14) NOT NULL,
  UserID VARCHAR(14) NOT NULL ,
  BookID VARCHAR(14) NOT NULL ,
  PRIMARY KEY (InterID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID),
  FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
CREATE TABLE IF NOT EXISTS BookImgs
(
  ImgID VARCHAR(14) NOT NULL,
  BookID VARCHAR(14) NOT NULL, /*Unique ID starting with B*/
  ImageURI VARCHAR(255) NOT NULL ,
  FOREIGN KEY (BookID) REFERENCES Books(BookID),
  PRIMARY KEY (ImgID)
);
CREATE TABLE IF NOT EXISTS Messages
(
  ChannelID CHAR(28),
  SenderID CHAR(14),
  ReceiverID CHAR(14) NOT NULL,
  TimeStamp DATETIME,
  MsgText CHAR(255),
  PictureID CHAR(14),
  ImageURI VARCHAR(255),
  MsgSerial SERIAL,
  SeenStatus BOOL NOT NULL DEFAULT FALSE,
  PRIMARY KEY (ChannelID, TimeStamp)
);
CREATE TABLE IF NOT EXISTS BookImgs
(
  ImgID VARCHAR(14) NOT NULL,
  BookID VARCHAR(14) NOT NULL,
  ImageURI VARCHAR(255) NOT NULL,
  TimeStamp TIMESTAMP NOT NULL,
  PRIMARY KEY (ImgID),
  FOREIGN KEY (BookID) REFERENCES Books(BookID)
);