-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 02 août 2021 à 16:22
-- Version du serveur : 10.3.29-MariaDB-0+deb10u1
-- Version de PHP : 7.3.29-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sudoku`
--

-- --------------------------------------------------------

--
-- Structure de la table `sudoku`
--

CREATE TABLE `sudoku` (
  `id_user` int(11) NOT NULL,
  `pseudo` varchar(100) NOT NULL,
  `confirmation` char(15) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `mdp` varchar(65) NOT NULL,
  `question` varchar(255) NOT NULL,
  `reponse` varchar(255) NOT NULL,
  `grille1` char(81) NOT NULL,
  `grille2` char(81) NOT NULL,
  `grille3` char(81) NOT NULL,
  `niveau` varchar(10) NOT NULL,
  `score` int(11) NOT NULL,
  `record` int(11) NOT NULL,
  `temps` time NOT NULL,
  `son` tinyint(1) NOT NULL,
  `options` tinyint(1) NOT NULL,
  `derniere_connexion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `sudoku`
--


--
-- Index pour les tables déchargées
--

--
-- Index pour la table `sudoku`
--
ALTER TABLE `sudoku`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD UNIQUE KEY `pseudo` (`pseudo`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `sudoku`
--
ALTER TABLE `sudoku`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
