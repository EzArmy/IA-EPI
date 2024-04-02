-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2024 at 06:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vigillatus`
--

-- --------------------------------------------------------

--
-- Table structure for table `cargos`
--

CREATE TABLE `cargos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `nivel` smallint(6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cargos`
--

INSERT INTO `cargos` (`id`, `nome`, `nivel`, `createdAt`, `updatedAt`) VALUES
(1, 'Tec. Segurança no trabalho', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Gestor', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'Mecânico', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Soldador', 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `colaboradores`
--

CREATE TABLE `colaboradores` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `idSetor` int(11) NOT NULL,
  `idCargo` int(11) NOT NULL,
  `idGestor` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `colaboradores`
--

INSERT INTO `colaboradores` (`id`, `nome`, `email`, `foto`, `idSetor`, `idCargo`, `idGestor`, `createdAt`, `updatedAt`) VALUES
(1, 'Colaborador 1', 'colaborador1@teste.com', 'mos-design-OYOXohNluvE-unsplash.jpg', 1, 4, 4, '2024-04-01 06:52:22', '2024-04-01 06:52:22'),
(2, 'Colaborador 2', 'colaborador2@teste.com', 'neom-TA5hw14Coh4-unsplash.jpg', 1, 4, 4, '2024-04-01 07:09:04', '2024-04-01 07:09:04');

-- --------------------------------------------------------

--
-- Table structure for table `gestores`
--

CREATE TABLE `gestores` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `idSetor` int(11) NOT NULL,
  `idCargo` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gestores`
--

INSERT INTO `gestores` (`id`, `nome`, `email`, `senha`, `foto`, `idSetor`, `idCargo`, `createdAt`, `updatedAt`) VALUES
(4, 'Jefferson Wilson', 'jeffersonwilson@teste.com', 'js', 'neom-HYHYGLs-Rp8-unsplash.jpg', 1, 2, '2024-04-01 05:22:45', '2024-04-01 05:22:45');

-- --------------------------------------------------------

--
-- Table structure for table `setores`
--

CREATE TABLE `setores` (
  `id` int(11) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setores`
--

INSERT INTO `setores` (`id`, `descricao`, `createdAt`, `updatedAt`) VALUES
(1, 'Oficina Mecânica', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Caldeira', '2024-03-30 18:10:00', '0000-00-00 00:00:00'),
(3, 'Carregamento', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cargos`
--
ALTER TABLE `cargos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `colaboradores`
--
ALTER TABLE `colaboradores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idSetor` (`idSetor`),
  ADD KEY `idCargo` (`idCargo`),
  ADD KEY `idGestor` (`idGestor`);

--
-- Indexes for table `gestores`
--
ALTER TABLE `gestores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idSetor` (`idSetor`),
  ADD KEY `idCargo` (`idCargo`);

--
-- Indexes for table `setores`
--
ALTER TABLE `setores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cargos`
--
ALTER TABLE `cargos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `colaboradores`
--
ALTER TABLE `colaboradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gestores`
--
ALTER TABLE `gestores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `setores`
--
ALTER TABLE `setores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `colaboradores`
--
ALTER TABLE `colaboradores`
  ADD CONSTRAINT `colaboradores_ibfk_1` FOREIGN KEY (`idSetor`) REFERENCES `setores` (`id`),
  ADD CONSTRAINT `colaboradores_ibfk_2` FOREIGN KEY (`idCargo`) REFERENCES `cargos` (`id`),
  ADD CONSTRAINT `colaboradores_ibfk_3` FOREIGN KEY (`idGestor`) REFERENCES `gestores` (`id`);

--
-- Constraints for table `gestores`
--
ALTER TABLE `gestores`
  ADD CONSTRAINT `gestores_ibfk_1` FOREIGN KEY (`idSetor`) REFERENCES `setores` (`id`),
  ADD CONSTRAINT `gestores_ibfk_2` FOREIGN KEY (`idCargo`) REFERENCES `cargos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
