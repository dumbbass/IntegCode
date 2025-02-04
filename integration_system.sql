-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2025 at 09:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";


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
  `purpose` varchar(255) NOT NULL,
  `status` enum('pending','approved','declined','completed','rescheduled') DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `schedule_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `doctor_id`, `purpose`, `status`, `remarks`, `created_at`, `updated_at`, `schedule_id`) VALUES
(89, 3, 5, 'consultation', 'pending', NULL, '2025-02-03 20:24:00', '2025-02-03 20:24:00', 200);

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
-- Table structure for table `doctor_schedules`
--

CREATE TABLE `doctor_schedules` (
  `schedule_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `available_date` date NOT NULL,
  `time_slot` varchar(20) NOT NULL,
  `status` enum('available','booked') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor_schedules`
--

INSERT INTO `doctor_schedules` (`schedule_id`, `doctor_id`, `available_date`, `time_slot`, `status`, `created_at`, `updated_at`) VALUES
(200, 5, '2025-02-08', '10:00 AM', 'booked', '2025-02-03 20:23:38', '2025-02-03 20:24:00');

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
(3, 50, 'Keanu', 'Nedruda', 'female', 'keanu@gmail.com', 55, 51, 'Yes', 'Olongapo', 'Filipino', 'Catholic', 'Single', 23, '1998-02-03', '456 Elm St, Sampletownddd', '09876543111', '2025-01-27 06:26:34', '2025-02-02 23:12:57'),
(5, 52, 'jojo', 'jojo', 'male', 'jojo@gmail.com', 55, 55, 'yes', 'Olongapo', 'Filipino', 'Catholic', 'single', 20, '2000-02-02', '456 Elm St, Sampletown', '09876543217', '2025-01-30 16:58:16', '2025-01-30 17:36:07'),
(8, 60, 'chinie', 'jojo', 'female', 'chinie1@gmail.com', 55, 55, 'yes', 'Olongapo', 'Filipino', 'Catholic', 'single', 23, '2001-01-01', '12', '09876543217', '2025-01-30 18:10:04', '2025-01-30 18:10:04'),
(9, 61, 'Arjay', 'San Jose', 'male', 'hahahehe123@gmail.com', 2, 2, 'yes', 'olongapo', '11adwassad', '11adwas', 'new', 11, '2004-07-07', '11ccc', '09123435678', '2025-01-31 04:58:09', '2025-01-31 04:58:09'),
(10, 62, 'arjay', 'sanjose', 'female', 'stephenbel@gmail.com', -3, -1, 'no', 'sasa', 'wewe', 'new', '11', 2, '2001-01-30', '68A elicano St.', '09121212121', '2025-01-31 05:27:38', '2025-01-31 05:27:38'),
(11, 63, 'wee', 'wee', 'male', 'last@gmail.com', 2, -2, 'yes', 'olongapo', 'Ppppp', 'ffd', 'haha', 11, '2004-03-10', '68A eSt.  E.B.B. Olongapo City', '09123435678', '2025-02-01 01:29:53', '2025-02-01 01:29:53'),
(12, 65, 'stephenbel', 'San Jose', 'female', 'stephenbel123@gmail.com', -11, 1, 'yes', 'd', 'Ppppp', 'fd', 'new', 11, '2003-02-27', '12345Main St', '09123435678', '2025-02-01 01:31:26', '2025-02-01 01:32:29'),
(13, 66, 'sanjose', 'San Jose', 'female', 'sanjose1234@gmail.com', 0, 2, 'yes', 'sasa', 'new', 'ewewe', 'ffddf', 11, '2004-02-04', '11ccc', '09123435678', '2025-02-01 01:35:53', '2025-02-01 01:35:53'),
(14, 67, 'baliw', 'baliw', 'male', 'baliw123@gmail.com', 2, -1, 'yes', 'sasa', 'wewe', 'ffd', '11', 11, '2003-02-27', '68A elicano St.', '09123435678', '2025-02-02 04:00:45', '2025-02-02 04:00:45'),
(15, 68, 'test', 'test', 'male', 'testtest123@gmail.com', 1, 2, 'yes', 'olongapo', 'new', 'new', 'ffddf', 155, '2004-02-10', '68A eSt.  E.B.B. Olongapo City', '09123435678', '2025-02-02 21:02:39', '2025-02-02 21:02:39'),
(16, 69, 'lasst', 'sasa', 'male', 'yokona123@gmail.com', 1, 1, 'yes', 'olongapo', '3', '3', 'w2w', 32, '2004-03-04', '11ccc', '09121212121', '2025-02-02 23:06:45', '2025-02-02 23:06:45');

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
(3, ' Chronic illnesses (e.g., diabetes, hypertension)', 'No surgeries', 'Regular medications', 'Known allergies', 'No past injuries/accidents', 'Special needs', 'Yes', 'No current issues'),
(5, 'yes 2022', 'no no no', 'biogesic', 'dogbite', 'planecrash', 'down syndrome', 'Yes', 'nice and nice'),
(7, 'asdasda', 'adsadad', '', '', '', '', 'No', ''),
(9, 'dsds', 'dsds', 'ds', 'dsd', 'dsds', 'dsd', 'No', 'dsds'),
(12, 'fdfdfdf', 'dfdfdfdf', 'dfdfdf', 'dfdfdf', 'ffefef', 'feff', 'Yes', 'fddfdfdf'),
(14, 'ddd', 'ddd', 'd', 'd', 'eee', 'eee', 'No', 'eeee');

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
(60, 'chinie', 'jojo', '2001-01-01', 'Female', '12', '09876543217', 'chinie1@gmail.com', '$2y$10$P.Gvouuz3EY56Hv0.9fCM.uPeO3yaD4dlUZICUbaNTF1UeFloDoBa', 'user', 'Olongapo', 'Filipino', 'Catholic', 'single', 23),
(61, 'Arjay', 'San Jose', '2004-07-07', 'Male', '11ccc', '09123435678', 'hahahehe123@gmail.com', '$2y$10$4/aayyh4JpW/zgMEsI4jdO2LARukwArx82BQAx7csUr0JIvgFMeNW', 'user', 'olongapo', '11adwassad', '11adwas', 'new', 11),
(62, 'arjay', 'sanjose', '2001-01-30', 'Female', '68A elicano St.', '09121212121', 'stephenbel@gmail.com', '$2y$10$IAX/SgObppBQ8XGOwA1xCugMPXXyTcQ8VD5SzqPI8IKHXsLZS4UmC', 'user', 'sasa', 'wewe', 'new', '11', 2),
(65, 'stephenbel', 'San Jose', '2003-02-27', 'Female', '12345Main St', '09123435678', 'stephenbel123@gmail.com', '$2y$10$9eGeLHMe7L8LvkRDPyQGAux1taB0d1DQaHV32ZvmN.OZFQj0uyCfa', 'user', 'd', 'Ppppp', 'fd', 'new', 11),
(66, 'sanjose', 'San Jose', '2004-02-04', 'Female', '11ccc', '09123435678', 'sanjose1234@gmail.com', '$2y$10$PwdycRVkExrPYLM12GArG.mp9NqpGkEol6B/k6m6ieXmfPr6U.oWW', 'user', 'sasa', 'new', 'ewewe', 'ffddf', 11),
(68, 'test', 'test', '2004-02-10', 'Male', '68A eSt.  E.B.B. Olongapo City', '09123435678', 'testtest123@gmail.com', '$2y$10$UPktFtRxrhHtDg56dd1YsuqRpO1X2Gg2cg9N8YoNNeCtQDqIH6mHK', 'user', 'olongapo', 'new', 'new', 'ffddf', 155),
(69, 'lasst', 'sasa', '2004-03-04', 'Male', '11ccc', '09121212121', 'yokona123@gmail.com', '$2y$10$Vhu/pfOHIns19d13hfwFX.eWljJI7SCXzjZ7bUoEVS50S91quukB2', 'user', 'olongapo', '3', '3', 'w2w', 32);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `schedule_id` (`schedule_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`doctor_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `doctor_id` (`doctor_id`);

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
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `doctor_schedules` (`schedule_id`),
  ADD CONSTRAINT `appointments_ibfk_4` FOREIGN KEY (`schedule_id`) REFERENCES `doctor_schedules` (`schedule_id`);

--
-- Constraints for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `doctor_schedules_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
