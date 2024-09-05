CREATE DATABASE IF NOT EXISTS `letsdance` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `letsdance`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 43.200.254.160    Database: letsdance
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 COLLATE utf8mb4_general_ci */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `member_no` int NOT NULL AUTO_INCREMENT,
  `member_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_profile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `member_pass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_role` enum('UESR','ADMIN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_tiktok_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`member_no`),
  UNIQUE KEY `UK_4rw879c4q7wrgi3v64cy73b17` (`member_id`),
  UNIQUE KEY `UK_j0kdf0m8cdj4uy6l7ntpgxrlo` (`member_nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'string','string','0','$2a$10$gkTFmYPJ9dlY2BOfCyr4quJfJiCWN5tvpp.3iatMGwNjDGrwfuo5S','UESR',NULL),(2,'ssafy','싸피','0','$2a$10$q8TIzmFFQZ2ryqD/9eqrreEIvz6Zun7VJ6gXoS/Wse59qKvBHiLuK','UESR',NULL),(3,'int','int','0','$2a$10$uDNIJEaHYbhfHl.0xpANmuZGYtJC.6W4g6A/sKOWjH5f5QRgZsrgq','UESR',NULL),(5,'ssaaffyy','ssaaffyy','0','$2a$10$1YHTglMLMGJ.z.2e8ygV..XNRNwalIP1QJV3JuXzX6oTqlKGhKBVO','UESR',NULL),(6,'samsung','SAMSUNG','0','$2a$10$FVZA9PCVp5jIyTNewvPBMuFRu.x33YcCrraYAkBTKeJPq2m1AzjHi','UESR',NULL);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_info`
--

DROP TABLE IF EXISTS `music_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_info` (
  `music_no` int NOT NULL AUTO_INCREMENT,
  `music_genre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `music_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `music_director` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`music_no`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_info`
--

LOCK TABLES `music_info` WRITE;
/*!40000 ALTER TABLE `music_info` DISABLE KEYS */;
INSERT INTO `music_info` VALUES (1,'dance','나는 아픈 건 딱 질색이니까','전소연'),(2,'dance','OTT','장원영'),(3,'dance','첫만남은 계획대로 되지 않아','Jeon Jin'),(4,'dance','마라탕후루','서이브'),(5,'dance','잘자요 아가씨','과나'),(6,'dance','HEYA','Ryan S.Jhun'),(7,'dance','사랑스러워','주영훈'),(8,'dance','Toca Toca','Mokaby'),(9,'dance','一笑江湖 (DJ版)','蒋雪儿Snow.J'),(10,'dance','퀸카','전소연'),(11,'dance','이브, 프시케 그리고 푸른 수염의 아내','방시혁'),(12,'dance','fast forward','TEDDY'),(13,'dance','Smoke','개코'),(14,'dance','첫 눈','Kenzie'),(15,'dance','アイドル','Ayase'),(16,'dance','See Tình','DTAP ');
/*!40000 ALTER TABLE `music_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_singer`
--

DROP TABLE IF EXISTS `music_singer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_singer` (
  `music_no` int NOT NULL,
  `singer_no` int NOT NULL,
  `music_singer_no` int NOT NULL,
  PRIMARY KEY (`music_no`,`singer_no`),
  UNIQUE KEY `UniqueMusicSinger` (`music_no`,`singer_no`),
  KEY `singer_no` (`singer_no`),
  CONSTRAINT `music_singer_ibfk_1` FOREIGN KEY (`music_no`) REFERENCES `music_info` (`music_no`),
  CONSTRAINT `music_singer_ibfk_2` FOREIGN KEY (`singer_no`) REFERENCES `singer_info` (`singer_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_singer`
--

LOCK TABLES `music_singer` WRITE;
/*!40000 ALTER TABLE `music_singer` DISABLE KEYS */;
INSERT INTO `music_singer` VALUES (1,1,0),(2,2,0),(3,3,0),(4,4,0),(5,5,0),(6,2,0),(7,6,0),(8,7,0),(9,8,0),(10,1,0),(11,9,0),(12,10,0),(13,11,0),(14,12,0),(15,13,0),(16,14,0);
/*!40000 ALTER TABLE `music_singer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shorts`
--

DROP TABLE IF EXISTS `shorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shorts` (
  `shorts_no` int NOT NULL AUTO_INCREMENT,
  `music_no` int NOT NULL,
  `shorts_challengers` int NOT NULL DEFAULT '0',
  `shorts_date` date DEFAULT NULL,
  `shorts_director` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shorts_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shorts_time` double NOT NULL,
  `shorts_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shorts_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`shorts_no`),
  KEY `music_no` (`music_no`),
  CONSTRAINT `shorts_ibfk_1` FOREIGN KEY (`music_no`) REFERENCES `music_info` (`music_no`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shorts`
--

LOCK TABLES `shorts` WRITE;
/*!40000 ALTER TABLE `shorts` DISABLE KEYS */;
INSERT INTO `shorts` 
VALUES 
	(1,1,30,'2024-03-25','몸치탈출연구소 (Fast dance)',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725346324787.mp4',
	17,	'(여자)아이들 \'나는 아픈 건 딱 질색이니까\' 안무❤️ 스텝 어려워요?🤔 거울모드 Dance Mirrored',
	'https://www.youtube.com/shorts/ePGG6356EPM'),
	(2,2,15,'2024-04-19','IVE',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725347501867.mp4',
	23,'워녕이의 OTT 들으면서 TURN 🧚‍♀ #IVE #아이브 #JANGWONYOUNG #장원영 #장원영턴 #IVE_OTT #OTT #Shorts',
	'https://www.youtube.com/shorts/Y2K964zyau8'),
	(3,3,12,'2024-02-08','남다른 The unique',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348129258.mp4',
	22,'우리 첫만남은 언제였어요?🤔 #첫만남은계획대로되지않아 #tws #kpopdancecover #dancechallenge #trenddance #onepickent #원픽이엔티',
	'https://www.youtube.com/shorts/RwtfIdE7eIY'),
	(4,4,1,'2024-05-07','몸치탈출연구소 (Fast dance)',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348269579.mp4',
	17,'마라탕후루 안무❤️ 마라탕VS탕후루 어떤 게 좋아요?🤔 거울모드 Dance Mirrored',
	'https://www.youtube.com/shorts/-E9WXh-f2Rk'),
	(5,5,25,'2024-03-20','몸치탈출연구소 (Fast dance)',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348396690.mp4',
	34,'잘자요 아가씨 안무❤️ 저의 집사가 되어주실 분?😻 거울모드 Dance Mirrored',
	'https://www.youtube.com/watch?v=nYA2FYd1anA'),
	(6,6,7,'2024-05-06','몸치탈출연구소 (Fast dance)',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348519546.mp4',
	20,'아이브 HEYA 안무❤️ 연습을 해야해야🔥 거울모드 Dance Mirrored',
	'https://www.youtube.com/watch?v=v6Ywdk_88f8'),
	(7,7,10,'2024-03-16','KINO',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348610562.mp4',
	21,'사랑스러워❤️ #kino #키노 #사랑스러워 #사랑스러워챌린지',
	'https://www.youtube.com/shorts/ogQgc60s1xI'),
	(10,10,5,'0202-05-17','어서오세희 SEHEE',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348762313.mp4',
	34,'Queencard👑',
	'https://www.youtube.com/shorts/wpm4mYgms1Y'),
	(12,12,8,'2023-08-17','KBS CoolFM',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348848881.mp4',
	17,'이 세상 힙이 아니다...🤩✨ 전소미 \'Fast Forward\' 포인트 안무✨ / [데이식스의 키스 더 라디오] | KBS 230816 방송',
	'https://www.youtube.com/shorts/IM-FgpU4-yI'),
	(13,13,29,'2023-09-26','아이키 AIKI',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725348979018.mp4',
	31,'어른키vs아이키 (아이키X바다) #smokechallenge #스모크챌린지 #스우파2',
	'https://www.youtube.com/shorts/GMAM03d8NAk'),
	(14,14,5,'2023-12-17','켈리아 kelly',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725349128233.mp4',
	12,'메리크리스마스❤️ #첫눈챌린지',
	'https://www.youtube.com/shorts/yq-1mGKDEhQ'),
	(15,15,4,'2024-05-24','혜찌Hyezzi',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725349218065.mp4',
	26,'최애의 완소 퍼펙트 반장❤️ #최애의아이 #shorts',
	'https://www.youtube.com/shorts/CwkPtjZtu9k'),
	(16,16,14,'2023-03-30','나는조이서 Joyseo',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725349293889.mp4',
	24,'띵띵땅땅 이 노래 가사가 이런 뜻이었어..? #shorts',
	'https://www.youtube.com/shorts/Niob9m3ccGY'),
	(17,4,13,'2023-12-05','오코이 OKOI',
	'https://b305-shortorial.s3.ap-northeast-2.amazonaws.com/1725349408521.mp4',
	33,'하오디라오 나루토춤 ! 왜 나루토춤일까 ? 🤔',
	'https://www.youtube.com/shorts/QXlBmySbWPE');
/*!40000 ALTER TABLE `shorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `singer_info`
--

DROP TABLE IF EXISTS `singer_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `singer_info` (
  `singer_no` int NOT NULL AUTO_INCREMENT,
  `singer_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `singer_gender` int NOT NULL,
  `singer_group` int NOT NULL,
  `singer_company` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`singer_no`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `singer_info`
--

LOCK TABLES `singer_info` WRITE;
/*!40000 ALTER TABLE `singer_info` DISABLE KEYS */;
INSERT INTO `singer_info` VALUES (1,'(G)I-DLE',0,1,'큐브'),(2,'IVE',0,2,'스타쉽'),(3,'TWS',1,3,'하이브'),(4,'서이브',0,4,'무소속'),(5,'ASMRZ',1,5,'무소속'),(6,'김종국',1,6,'터보제이케이컴퍼니'),(7,'Fly project',1,7,'무소속'),(8,'闻人听書',1,8,'무소속'),(9,'르세라핌',0,9,'하이브'),(10,'전소미',0,10,'더블랙레이블'),(11,'다이나믹 듀오',1,11,'아메바컬쳐'),(12,'EXO',1,12,'SM'),(13,'YOASOBI',0,13,'무소속'),(14,'Hoàng Thùy Linh',0,14,'무소속');
/*!40000 ALTER TABLE `singer_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `try_shorts`
--

DROP TABLE IF EXISTS `try_shorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `try_shorts` (
  `try_no` int NOT NULL AUTO_INCREMENT,
  `upload_date` datetime(6) NOT NULL,
  `member_no` int DEFAULT NULL,
  `shorts_no` int DEFAULT NULL,
  PRIMARY KEY (`try_no`),
  KEY `FK427nitxtp2smjodqiomo9dd8g` (`member_no`),
  KEY `FKklrg8jrywal4yh13uo2o5rms0` (`shorts_no`),
  CONSTRAINT `FK427nitxtp2smjodqiomo9dd8g` FOREIGN KEY (`member_no`) REFERENCES `member` (`member_no`),
  CONSTRAINT `FKklrg8jrywal4yh13uo2o5rms0` FOREIGN KEY (`shorts_no`) REFERENCES `shorts` (`shorts_no`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `try_shorts`
--

LOCK TABLES `try_shorts` WRITE;
/*!40000 ALTER TABLE `try_shorts` DISABLE KEYS */;
INSERT INTO `try_shorts` VALUES (1,'2024-05-17 03:43:31.505708',3,2),(2,'2024-05-19 16:32:48.966164',3,4),(3,'2024-05-16 13:02:57.151130',3,7),(4,'2024-05-16 13:03:05.911037',3,14),(5,'2024-05-16 16:04:31.263002',3,12),(6,'2024-05-19 22:57:12.569368',1,1),(7,'2024-05-19 19:58:01.129514',1,5),(8,'2024-05-19 23:40:17.432026',2,1),(9,'2024-05-19 23:10:48.583754',1,7),(10,'2024-05-19 13:18:09.929249',1,2),(11,'2024-05-19 17:39:34.348957',3,5),(12,'2024-05-19 23:44:45.987636',1,3),(13,'2024-05-19 23:45:29.494780',3,3),(14,'2024-05-19 10:09:45.218147',1,12),(15,'2024-05-17 04:35:19.905283',2,4),(16,'2024-05-17 04:36:18.590062',2,5),(17,'2024-05-19 19:34:43.819701',3,1),(20,'2024-05-19 20:38:34.815083',1,13),(21,'2024-05-17 05:36:00.106485',1,15),(22,'2024-05-19 22:47:48.781130',1,14),(23,'2024-05-19 19:14:47.127714',6,13),(24,'2024-05-19 19:22:24.648981',6,1),(25,'2024-05-19 19:29:15.082545',1,6);
/*!40000 ALTER TABLE `try_shorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upload_shorts`
--

DROP TABLE IF EXISTS `upload_shorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upload_shorts` (
  `upload_no` int NOT NULL AUTO_INCREMENT,
  `upload_date` datetime(6) NOT NULL,
  `upload_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upload_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_no` int DEFAULT NULL,
  `sns_no` int DEFAULT NULL,
  PRIMARY KEY (`upload_no`),
  UNIQUE KEY `UK_5epqj91lq68kitqcc8q4dkvwm` (`sns_no`),
  KEY `FKi9cae422m4c35ndoabij8h9h1` (`member_no`),
  CONSTRAINT `FKi9cae422m4c35ndoabij8h9h1` FOREIGN KEY (`member_no`) REFERENCES `member` (`member_no`),
  CONSTRAINT `FKrbvy02ymxlm4t0n5a2vsrlane` FOREIGN KEY (`sns_no`) REFERENCES `upload_sns` (`sns_no`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upload_shorts`
--

LOCK TABLES `upload_shorts` WRITE;
/*!40000 ALTER TABLE `upload_shorts` DISABLE KEYS */;
INSERT INTO `upload_shorts` VALUES (5,'2024-05-16 00:00:00.000000','int/오늘 우린','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/int/%EC%98%A4%EB%8A%98%20%EC%9A%B0%EB%A6%B0','https://www.youtube.com/watch?v=by4q7uFxGm8',3,NULL),(6,'2024-05-16 00:00:00.000000','int/내일 우린','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/int/%EB%82%B4%EC%9D%BC%20%EC%9A%B0%EB%A6%B0','https://www.youtube.com/watch?v=nGNY76ieNVU',3,NULL),(23,'2024-05-17 04:36:33.255766','string/20240517133632','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517133632',NULL,1,NULL),(24,'2024-05-17 04:39:09.100480','string/20240517133908','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517133908',NULL,1,NULL),(25,'2024-05-17 04:42:33.592046','string/20240517134233','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517134233',NULL,1,NULL),(26,'2024-05-17 04:55:20.294687','int/20240517135519','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/int/20240517135519','https://www.youtube.com/watch?v=hvBtkJyqdjM',3,NULL),(27,'2024-05-17 04:58:11.841262','string/20240517135811','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517135811','https://www.youtube.com/watch?v=0CNKYYd0Ans',1,NULL),(28,'2024-05-17 05:52:09.401643','string/20240517145208','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517145208',NULL,1,NULL),(29,'2024-05-17 06:39:53.509047','ssafy/20240517153952','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/ssafy/20240517153952',NULL,2,NULL),(30,'2024-05-17 06:40:50.095684','ssafy/20240517154048','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/ssafy/20240517154048',NULL,2,NULL),(31,'2024-05-17 06:42:04.399379','ssafy/20240517154203','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/ssafy/20240517154203',NULL,2,NULL),(32,'2024-05-17 06:43:27.562313','ssafy/20240517154326','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/ssafy/20240517154326',NULL,2,NULL),(33,'2024-05-17 06:43:43.321556','ssafy/20240517154342','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/ssafy/20240517154342',NULL,2,NULL),(34,'2024-05-17 06:49:28.472450','string/20240517154926','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517154926',NULL,1,NULL),(35,'2024-05-17 07:04:26.133329','string/20240517160421','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517160421',NULL,1,NULL),(40,'2024-05-17 07:22:27.055262','string/20240517162223','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517162223',NULL,1,NULL),(41,'2024-05-17 07:24:15.429604','string/20240517162413','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517162413',NULL,1,NULL),(42,'2024-05-17 07:25:05.428501','string/나다!','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/%EB%82%98%EB%8B%A4%21','https://www.youtube.com/watch?v=h2jvkB4Coc4',1,NULL),(45,'2024-05-17 08:49:54.926243','string/20240517174954','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517174954',NULL,1,NULL),(46,'2024-05-17 08:53:10.259276','string/20240517175309','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517175309',NULL,1,NULL),(47,'2024-05-17 08:58:47.558052','string/20240517175847','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240517175847',NULL,1,NULL),(48,'2024-05-18 08:33:31.066896','string/20240518173330','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240518173330',NULL,1,NULL),(56,'2024-05-19 07:07:04.204315','string/20240519160703','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240519160703',NULL,1,NULL),(57,'2024-05-19 07:11:29.592483','string/20240519161129','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240519161129',NULL,1,NULL),(58,'2024-05-19 09:40:36.915548','string/20240519184036','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240519184036',NULL,1,NULL),(59,'2024-05-19 10:35:49.938792','string/20240519193549','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240519193549',NULL,1,NULL),(60,'2024-05-19 12:26:03.577445','string/20240519212547','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240519212547',NULL,1,NULL),(65,'2024-05-19 19:30:17.237941','int/20240520043016','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/int/20240520043016',NULL,3,NULL),(66,'2024-05-19 19:35:51.100201','int/20240520043550','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/int/20240520043550',NULL,3,NULL),(68,'2024-05-19 23:40:59.898610','ssafy/20240520084058','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/ssafy/20240520084058',NULL,2,NULL),(69,'2024-05-19 23:47:06.321242','string/20240520084704','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/string/20240520084704',NULL,1,NULL),(70,'2024-05-19 23:52:20.737100','int/20240520085219','https://ssafy2024-dance.s3.ap-northeast-2.amazonaws.com/int/20240520085219',NULL,3,NULL);
/*!40000 ALTER TABLE `upload_shorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upload_sns`
--

DROP TABLE IF EXISTS `upload_sns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upload_sns` (
  `sns_no` int NOT NULL AUTO_INCREMENT,
  `insta_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticktok_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `upload_no` int DEFAULT NULL,
  PRIMARY KEY (`sns_no`),
  UNIQUE KEY `UK_ssx7vpfe24211tahxfp4wl6ef` (`upload_no`),
  CONSTRAINT `FKfegtii235pa1p3xs4u50ykhkn` FOREIGN KEY (`upload_no`) REFERENCES `upload_shorts` (`upload_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upload_sns`
--

LOCK TABLES `upload_sns` WRITE;
/*!40000 ALTER TABLE `upload_sns` DISABLE KEYS */;
/*!40000 ALTER TABLE `upload_sns` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-20  9:06:30