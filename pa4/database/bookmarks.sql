DROP TABLE IF EXISTS `Bookmarks`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Folders`;
DROP TRIGGER IF EXISTS `Folders`;

CREATE TABLE `Bookmarks` (
  `id`          INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uid`         INT(11) UNSIGNED NOT NULL,
  `url`         VARCHAR(512)              DEFAULT NULL,
  `folderId`    INT(11) UNSIGNED NOT NULL,
  `name`        VARCHAR(40)               DEFAULT NULL,
  `description` VARCHAR(2048)             DEFAULT NULL,
  `keywords`    VARCHAR(256)              DEFAULT NULL,
  `favorite`    INT(1) UNSIGNED  NOT NULL,
  `folder`      BOOLEAN          NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE (`folderId`, `name`, `uid`),
  KEY FK_FolderId (`folderId`, `uid`),
  KEY FK_UserId (`uid`),
  CONSTRAINT FK_Folder FOREIGN KEY (`folderId`, `uid`) REFERENCES Bookmarks (`id`, `uid`),
  CONSTRAINT FK_Folder FOREIGN KEY (`uid`) REFERENCES Users (`id`)
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

# Create a new root folder when a new user is created
DELIMITER $$
CREATE TRIGGER `create_root_folder_user_ins_trig` AFTER INSERT ON `Users`
FOR EACH ROW
  BEGIN
    INSERT INTO `Bookmarks` (`uid`, `folderId`, `name`, `favorite`, `folder`)
    VALUES (new.id, 0, 'root', 0, TRUE);
  END $$

DELIMITER ;


LOCK TABLES `Users` WRITE;
INSERT INTO `Users` (`id`, `username`, `password`)

VALUES
  (1, 'cse136User', '$2a$10$klfx5Qy78NoRQ5A5zJ3Dou6UoqX5RuGNPrO/uK6358t5in8i./R0a'),
  (2, 'user', '$2a$10$klfx5Qy78NoRQ5A5zJ3DourDK/MJ5bhwfSeeDmUW06M9mXNZJPUe6');

UNLOCK TABLES;

LOCK TABLES `Bookmarks` WRITE;
/*!40000 ALTER TABLE `Bookmarks`
  DISABLE KEYS */;

INSERT INTO `Bookmarks` (`uid`, `url`, `folderId`, `name`, `description`, `keywords`, `favorite`, `folder`)

VALUES
  (2, 'https://mail.google.com', 1, 'Gmail', 'electronic mail', 'social', 0, FALSE),
  (2, 'https://www.facebook.com/', 1, 'Facebook', 'waste of time', 'social', 0, FALSE),
  (2, NULL, 1, 'A folder', NULL, NULL, 1, TRUE),
  (1, 'https://angularjs.org/', 1, 'Angular', 'pretty cool framework', 'cs', 0, FALSE),
  (2, 'https://github.com/', 4, 'Github', 'post code here', 'cs', 0, FALSE),
  (2, NULL, 1, 'B folder', NULL, NULL, 1, TRUE);


/*!40000 ALTER TABLE `Bookmarks`
  ENABLE KEYS */;
UNLOCK TABLES;