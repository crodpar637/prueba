-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 14-09-2024 a las 16:09:10
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ticketmania`
--
CREATE DATABASE IF NOT EXISTS `ticketmania` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish2_ci;
USE `ticketmania`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `seat_id` int DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `user_id` (`user_id`),
  KEY `seat_id` (`seat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `description` text COLLATE utf8mb3_spanish2_ci,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `location_id` int DEFAULT NULL,
  `status` enum('active','blocked') COLLATE utf8mb3_spanish2_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `location_id` (`location_id`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_images`
--

DROP TABLE IF EXISTS `event_images`;
CREATE TABLE IF NOT EXISTS `event_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb3_spanish2_ci NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event_zones`
--

DROP TABLE IF EXISTS `event_zones`;
CREATE TABLE IF NOT EXISTS `event_zones` (
  `event_zone_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `zone_id` int DEFAULT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`event_zone_id`),
  KEY `event_id` (`event_id`),
  KEY `zone_id` (`zone_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locations`
--

DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `total_capacity` int NOT NULL,
  `google_maps_url` varchar(255) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  `plan_image_url` varchar(255) COLLATE utf8mb3_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `locations`
--

INSERT INTO `locations` (`location_id`, `name`, `address`, `total_capacity`, `google_maps_url`, `plan_image_url`) VALUES
(1, 'Gillian Lynne Theatre', '166 Drury Ln, London WC2B 5PW, UK', 600, 'https://maps.app.goo.gl/1gD5Wvh2kGGTADpJ8', 'http://localhost:3000/assets/images/location_maps/1.drawio.png'),
(2, 'Royal Albert Hall', 'Kensington Gore, South Kensington, London SW7 2AP, UK', 1000, 'https://g.co/kgs/sMjLP6w', 'http://localhost:3000/assets/images/location_maps/2.drawio.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `location_images`
--

DROP TABLE IF EXISTS `location_images`;
CREATE TABLE IF NOT EXISTS `location_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb3_spanish2_ci NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `location_id` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `location_images`
--

INSERT INTO `location_images` (`image_id`, `location_id`, `image_url`) VALUES
(1, 1, 'https://assets.lwtheatres.co.uk/wp-content/uploads/2023/09/14121715/Gillian-1-1600x1000.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('completed','failed') COLLATE utf8mb3_spanish2_ci DEFAULT 'completed',
  PRIMARY KEY (`payment_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seats`
--

DROP TABLE IF EXISTS `seats`;
CREATE TABLE IF NOT EXISTS `seats` (
  `seat_id` int NOT NULL AUTO_INCREMENT,
  `event_zone_id` int NOT NULL,
  `row_number` int NOT NULL,
  `seat_number` int NOT NULL,
  `status` enum('available','occupied') COLLATE utf8mb3_spanish2_ci NOT NULL DEFAULT 'available',
  PRIMARY KEY (`seat_id`),
  UNIQUE KEY `unique_seat` (`event_zone_id`,`row_number`,`seat_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `seat_id` int DEFAULT NULL,
  `purchase_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('purchased','cancelled') COLLATE utf8mb3_spanish2_ci DEFAULT 'purchased',
  PRIMARY KEY (`ticket_id`),
  KEY `user_id` (`user_id`),
  KEY `seat_id` (`seat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb3_spanish2_ci NOT NULL DEFAULT 'user',
  `status` enum('active','blocked') COLLATE utf8mb3_spanish2_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `first_name`, `last_name`, `role`, `status`, `created_at`) VALUES
(3, 'Anabel', 'anabel@gmail.com', '$2b$10$qob6TdFqYnREXWzglMR5xuphz/HLMRpmey/qyAsR3mevZph/N73By', 'Ana', 'Ligero', 'admin', 'active', '2024-09-07 10:27:21'),
(4, 'Romero', 'romero@gmail.com', '$2b$10$uCLUABBpTW0ZHysMFW8YOOKw9wFeMDU6mIkKXSq7Jni8KPE9zMeuK', 'Romero', 'Rodriguez', 'user', 'blocked', '2024-09-07 12:34:26'),
(5, 'Ana', 'ana@gmail.com', '$2b$10$8LH2IT1drW7d3g8PPWmZbuZbg35u.uAB3mYBkILlsiyoO9PE4SdNq', 'Ana', 'Rodriguez', 'user', 'active', '2024-09-09 16:44:03'),
(6, 'Juanito', 'juan@gmail.com', '$2b$10$m.irpTiCgsd/vuwCBzUYpea0AS2D3pP1BquzDuOtyV81JoI9MrNnK', 'Juanito', 'Ramos', 'user', 'active', '2024-09-09 18:15:07'),
(7, 'Ignacia', 'ignacia@gmail.com', '$2b$10$pmQ/m1VIy5nlYMPhwzL/../tcIO5wI0olFvipuL/BXistgQOH4SFu', 'Ignacia', 'Piña', 'user', 'active', '2024-09-14 10:19:46'),
(8, 'Julia', 'julia@gmail.com', '$2b$10$UPacNG3GZCj9rqbu6G3nL.09QIsIquU7pQEZh.9mbunZPjTI5IcG2', 'juliarl', 'Rodriguez', 'admin', 'active', '2024-09-14 16:07:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zones`
--

DROP TABLE IF EXISTS `zones`;
CREATE TABLE IF NOT EXISTS `zones` (
  `zone_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb3_spanish2_ci NOT NULL,
  `num_rows` int NOT NULL,
  `seats_per_row` int NOT NULL,
  PRIMARY KEY (`zone_id`),
  KEY `location_id` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `zones`
--

INSERT INTO `zones` (`zone_id`, `location_id`, `name`, `num_rows`, `seats_per_row`) VALUES
(1, 1, 'ZONE A', 5, 20),
(2, 1, 'ZONE B', 10, 20),
(3, 1, 'ZONE C', 15, 20),
(14, 2, 'STALLS', 30, 20),
(15, 2, 'AMPHITHEATRE', 10, 20),
(16, 2, 'GALLERY', 10, 20),
(17, 2, 'LEFT BOX', 3, 15),
(18, 2, 'RIGHT BOX', 3, 15);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`seat_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `event_images`
--
ALTER TABLE `event_images`
  ADD CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `event_zones`
--
ALTER TABLE `event_zones`
  ADD CONSTRAINT `event_zones_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_zones_ibfk_2` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`zone_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `location_images`
--
ALTER TABLE `location_images`
  ADD CONSTRAINT `location_images_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `FK_event_zone_id` FOREIGN KEY (`event_zone_id`) REFERENCES `event_zones` (`event_zone_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`seat_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `zones`
--
ALTER TABLE `zones`
  ADD CONSTRAINT `zones_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
