--
-- Base de datos: `pokecards`
--
CREATE DATABASE IF NOT EXISTS `pokecards` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `pokecards`;
--
-- Estructura de tabla para la tabla `ranking`
--

CREATE TABLE `ranking` (
  `nick` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `ip` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `partidas_ganadas` int(11) NOT NULL,
  `puntos_ganados` int(11) NOT NULL,
  `partidas_perdidas` int(11) NOT NULL,
  `puntos_perdidos` int(11) NOT NULL,
  `partidas_empatadas` int(11) NOT NULL,
  `partidas_jugadas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
