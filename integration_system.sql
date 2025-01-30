-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2025 at 07:16 PM
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
-- Database: `integration_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time DEFAULT NULL,
  `purpose` varchar(255) NOT NULL,
  `status` enum('pending','accepted','completed','rescheduled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `purpose`, `status`, `created_at`, `updated_at`) VALUES
(5, 1, 5, '2025-01-16', NULL, 'checkup', 'pending', '2025-01-15 14:40:45', '2025-01-15 14:40:45'),
(7, 1, 5, '2025-01-26', NULL, 'checkup', 'pending', '2025-01-27 04:34:05', '2025-01-27 04:34:05');

-- --------------------------------------------------------

--
-- Table structure for table `appointment_status_history`
--

CREATE TABLE `appointment_status_history` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `status` enum('Rescheduled','Accepted','Cancelled') NOT NULL,
  `action_taken_by` int(11) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `doctor_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`doctor_id`, `id`, `firstname`, `lastname`, `gender`, `email`, `created_at`, `updated_at`) VALUES
(5, 34, 'Jeffry', 'Olaes', 'male', 'jeffry@gmail.com', '2025-01-15 10:09:10', '2025-01-15 10:09:10');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `patient_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `email` varchar(255) NOT NULL,
  `height` int(11) DEFAULT 0,
  `weight` int(11) DEFAULT 0,
  `medications` text NOT NULL,
  `birthplace` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `home_address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`patient_id`, `id`, `firstname`, `lastname`, `gender`, `email`, `height`, `weight`, `medications`, `birthplace`, `nationality`, `religion`, `civil_status`, `age`, `date_of_birth`, `home_address`, `contact_number`, `created_at`, `updated_at`) VALUES
(3, 50, 'Keanu', 'Nedruda', 'female', 'keanu@gmail.com', 52, 52, 'Yes', 'Olongapo', 'Filipino', 'Catholic', 'Single', 23, NULL, '456 Elm St, Sampletown', '09876543217', '2025-01-27 06:26:34', '2025-01-30 16:46:24'),
(5, 52, 'jojo', 'jojo', 'male', 'jojo@gmail.com', 55, 55, 'yes', 'Olongapo', 'Filipino', 'Catholic', 'single', 20, '2000-02-02', '456 Elm St, Sampletown', '09876543217', '2025-01-30 16:58:16', '2025-01-30 17:36:07'),
(8, 60, 'chinie', 'jojo', 'female', 'chinie1@gmail.com', 55, 55, 'yes', 'Olongapo', 'Filipino', 'Catholic', 'single', 23, '2001-01-01', '12', '09876543217', '2025-01-30 18:10:04', '2025-01-30 18:10:04');

-- --------------------------------------------------------

--
-- Table structure for table `patient_history`
--

CREATE TABLE `patient_history` (
  `patient_id` int(11) NOT NULL,
  `medical_history` text DEFAULT NULL,
  `surgical_history` text DEFAULT NULL,
  `medications` text DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `injuries_accidents` text DEFAULT NULL,
  `special_needs` text DEFAULT NULL,
  `blood_transfusion` varchar(10) DEFAULT 'No',
  `present_history` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_history`
--

INSERT INTO `patient_history` (`patient_id`, `medical_history`, `surgical_history`, `medications`, `allergies`, `injuries_accidents`, `special_needs`, `blood_transfusion`, `present_history`) VALUES
(5, 'yes 2022', 'no no no', 'biogesic', 'dogbite', 'planecrash', 'down syndrome', 'Yes', 'nice and nice'),
(7, 'asdasda', 'adsadad', '', '', '', '', 'No', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `home_address` text DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `birthplace` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `date_of_birth`, `gender`, `home_address`, `contact_number`, `email`, `password`, `role`, `birthplace`, `nationality`, `religion`, `civil_status`, `age`) VALUES
(34, 'Jeffry', 'Olaes', '1990-01-01', 'Male', '123 Main St', '1234567890', 'jeffry@gmail.com', '$2y$10$Ok1T5VnsKCdVZ/wFNrzTKu5.3JhFx5hKAN7OcP1xDITnx8sBCxFFm', 'admin', NULL, NULL, NULL, NULL, NULL),
(50, 'Keanu', 'Nedruda', '1990-02-01', 'Female', '456 Elm St, Sampletown', '09876543217', 'keanu@gmail.com', '$2y$10$djOUQbo4CWku4P090yOiJ.4LBtRdXEYimgxxRisRY0rp6egsMqgyS', 'user', NULL, NULL, NULL, NULL, NULL),
(52, 'jojo', 'jojo', '2000-02-02', 'Male', '456 Elm St, Sampletown', '09876543217', 'jojo@gmail.com', '$2y$10$570AVlYNdlyVFuo1T3dHU.FXVY9HSIUZrmcrChK90.1vgEr2v0Lry', 'user', 'Olongapo', 'Filipino', 'Catholic', 'single', 20),
(55, 'chinie', 'jojo', '2000-01-01', 'Female', 'cabalan', '09876543217', 'chinie@gmail.com', '$2y$10$LTZ48.fwBlYbN5F4SIkg/eFlAz98/P/.z2tYPz167JFTeEQQa8kcW', 'user', 'Olongapo', 'Filipino', 'Catholic', 'single', 20),
(60, 'chinie', 'jojo', '2001-01-01', 'Female', '12', '09876543217', 'chinie1@gmail.com', '$2y$10$P.Gvouuz3EY56Hv0.9fCM.uPeO3yaD4dlUZICUbaNTF1UeFloDoBa', 'user', 'Olongapo', 'Filipino', 'Catholic', 'single', 23);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `appointment_status_history`
--
ALTER TABLE `appointment_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `action_taken_by` (`action_taken_by`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`doctor_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`),
  ADD KEY `fk_patient_user` (`id`);

--
-- Indexes for table `patient_history`
--
ALTER TABLE `patient_history`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `appointment_status_history`
--
ALTER TABLE `appointment_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
