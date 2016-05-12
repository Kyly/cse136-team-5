/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



DROP TABLE IF EXISTS `Bookmarks`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Folders`;

CREATE TABLE `Bookmarks` (
  `id`           int(11) unsigned       NOT NULL AUTO_INCREMENT,
  `url`          varchar(512)           NOT NULL,
  `folderId`     int(11) unsigned       NOT NULL,
  `name`         varchar(40)            DEFAULT NULL,
  `description`  varchar(2048)          DEFAULT NULL,
  `keywords`     varchar(256)           DEFAULT NULL,
  `favorite`     int(1) unsigned        NOT NULL,

  PRIMARY KEY (`id`),
  KEY FK_FolderId (folderId),
    CONSTRAINT FK_Folder FOREIGN KEY (folderId) REFERENCES Folders (id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `Folders` (
   `id`           int(11) unsigned       NOT NULL AUTO_INCREMENT,
   `name`         varchar(64)            NOT NULL,
   `parent`       int(11) unsigned       NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `Users` (
  `id`          int(11) unsigned       NOT NULL AUTO_INCREMENT,
  `username`    varchar(32)            NOT NULL,
  `password`    varchar(32)            DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


LOCK TABLES `users` WRITE;
INSERT INTO `users` (`id`, `username`, `password`)

VALUES
	(1, 'cse136User', 'cse136PW'),
	(2, 'user', '123');
	
UNLOCK TABLES;



LOCK TABLES `Folders` WRITE;
/*!40000 ALTER TABLE `Folders` DISABLE KEYS */;

INSERT INTO `Folders` (`id`, `name`, `parent`)

VALUE
    (1, 'root', 0);


/*!40000 ALTER TABLE `Folders` ENABLE KEYS */;
UNLOCK TABLES;



LOCK TABLES `Bookmarks` WRITE;
/*!40000 ALTER TABLE `Bookmarks` DISABLE KEYS */;

INSERT INTO `Bookmarks` (`id`, `url`, `folderId`, `name`, `description`, `keywords`, `favorite`)

VALUES
	(1, 'https://mail.google.com'  ,1, 'Gmail','electronic mail' ,'social' ,0 ),
	(2, 'https://www.facebook.com/',1, 'Facebook','waste of time' ,'social' ,0 ),
	(3, 'https://angularjs.org/'   ,1, 'Angular','pretty cool framework' ,'cs' ,0 ),
	(4, 'https://github.com/'      ,1, 'Github','post code here' ,'cs' ,0 );



/*!40000 ALTER TABLE `Bookmarks` ENABLE KEYS */;
UNLOCK TABLES;