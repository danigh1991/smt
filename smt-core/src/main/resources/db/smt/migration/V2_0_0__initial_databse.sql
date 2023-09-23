CREATE DATABASE IF NOT EXISTS `smt_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;

--
-- Table structure for table `fileStorage`
--
CREATE TABLE IF NOT EXISTS `fileStorage` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `uploadDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `content` longblob NOT NULL,
  `checkSum` varchar(40) NOT NULL,
  `creatorUserId` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `fileStorageDetail`
--
CREATE TABLE IF NOT EXISTS `fileStorageDetail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `destDepositNo` varchar(20),
  `destSheba` varchar(26),
  `destBankCode` varchar(3),
  `destFirstName` varchar(100),
  `destLastName` varchar(100),
  `amount` bigint(20) NOT NULL,
  `sourceComment` varchar(100),
  `destComment` varchar(100),
  `deleted` tinyint(1) DEFAULT '0',
  `fileStorageId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `fileSubmission`
--
CREATE TABLE IF NOT EXISTS `fileSubmission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `submitDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL,
  `fromAccountId` bigint(20) NOT NULL,
  `fileStorageId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `fileSubmissionDetail`
--
CREATE TABLE IF NOT EXISTS `fileSubmissionDetail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `paymentId` varchar(100) NOT NULL,
  `sentDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL,
  `paymentType` varchar(1) NOT NULL,
  `fileStorageDetailId` bigint(20) NOT NULL,
  `fileSubmissionId` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `account`
--
CREATE TABLE IF NOT EXISTS `account` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountNumber` varchar(20) NOT NULL,
  `sheba` varchar(26) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

