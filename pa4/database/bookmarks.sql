/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;


DROP TABLE IF EXISTS `Bookmarks`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Folders`;

CREATE TABLE `Bookmarks` (
  `id`          INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `url`         VARCHAR(512)              DEFAULT NULL,
  `folderId`    INT(11) UNSIGNED NOT NULL,
  `name`        VARCHAR(40)               DEFAULT NULL,
  `description` VARCHAR(2048)             DEFAULT NULL,
  `keywords`    VARCHAR(256)              DEFAULT NULL,
  `favorite`    INT(1) UNSIGNED  NOT NULL,
  `folder`      BOOLEAN          NOT NULL,

  UNIQUE (`folderId`, `name`),
    PRIMARY KEY (`id`),
  KEY FK_FolderId (folderId),
  CONSTRAINT FK_Folder FOREIGN KEY (folderId) REFERENCES Bookmarks (id)
)
  ENGINE = MyISAM
  DEFAULT CHARSET = latin1;


CREATE TABLE `Folders` (
  `id`     INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`   VARCHAR(64)      NOT NULL,
  `parent` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = MyISAM
  DEFAULT CHARSET = latin1;


CREATE TABLE `Users` (
  `id`       INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(32)      NOT NULL,
  `password` VARCHAR(60)               DEFAULT NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = MyISAM
  DEFAULT CHARSET = latin1;


LOCK TABLES `Users` WRITE;
INSERT INTO `Users` (`id`, `username`, `password`)

VALUES
  (1, 'cse136User', '$2a$10$klfx5Qy78NoRQ5A5zJ3Dou6UoqX5RuGNPrO/uK6358t5in8i./R0a'),
  (2, 'user', '$2a$10$klfx5Qy78NoRQ5A5zJ3DourDK/MJ5bhwfSeeDmUW06M9mXNZJPUe6');

UNLOCK TABLES;


LOCK TABLES `Folders` WRITE;
/*!40000 ALTER TABLE `Folders`
  DISABLE KEYS */;

INSERT INTO `Folders` (`id`, `name`, `parent`)

  VALUE
  (1, 'root', 0),
  (2, 'Foo bar', 1),
  (3, 'Baz', 1);


/*!40000 ALTER TABLE `Folders`
  ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `Bookmarks` WRITE;
/*!40000 ALTER TABLE `Bookmarks`
  DISABLE KEYS */;

INSERT INTO `Bookmarks` (`id`, `url`, `folderId`, `name`, `description`, `keywords`, `favorite`, `folder`)

VALUES
  (1, NULL, 0, 'root', NULL , NULL, 0, TRUE),
  (2, 'https://mail.google.com', 1, 'Gmail', 'electronic mail', 'social', 0, FALSE),
  (3, 'https://www.facebook.com/', 1, 'Facebook', 'waste of time', 'social', 0, FALSE),
  (4, NULL, 1, 'A folder', NULL, NULL, 1, TRUE),
  (5, 'https://angularjs.org/', 4, 'Angular', 'pretty cool framework', 'cs', 0, FALSE),
  (6, 'https://github.com/', 4, 'Github', 'post code here', 'cs', 0, FALSE);


/*!40000 ALTER TABLE `Bookmarks`
  ENABLE KEYS */;
UNLOCK TABLES;