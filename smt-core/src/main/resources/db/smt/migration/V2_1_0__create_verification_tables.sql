CREATE TABLE IF NOT EXISTS `phoneVerification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(11) NOT NULL,
  `name` varchar(100),
  `surName` varchar(100),
  `token` varchar(100),
  `tokenExpiry` TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `fileVerification` (
  `fileId` bigint(20) NOT NULL,
  `phoneId` bigint(20) NOT NULL,
  PRIMARY KEY (`fileId`,`phoneId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;