SELECT Transient.BookID AS BookID,Transient.UserID AS UserID,Transient.Title AS Title,
Transient.Edition AS Edition,Transient.Authors AS Authors,Transient.Description AS Description,
Transient.Cover AS Cover,Transient.PageNo AS PageNo,Transient.Publisher AS Publisher,
Transient.Published AS Published,Transient.ISBN as ISBN,Transient.New AS New,
Transient.Condition AS `Condition`, Transient.Location AS Location,
Transient.Price AS Price,Transient.Deliverable AS Deliverable,
Transient.DateAdded AS DateAdded,Transient.OfferExpiry AS OfferExpiry,
Transient.BookSerial AS BookSerial,BookImgs.ImageURI AS ImageURI,BookImgs.ImgID AS ImgID
 FROM (SELECT * FROM (SELECT * FROM `Books` WHERE `UserID`='Ucc8e10b62f724')
  AS TempTable ORDER BY `BookSerial` DESC LIMIT 25) AS Transient LEFT JOIN
  BookImgs ON Transient.BookID=BookImgs.BookID
