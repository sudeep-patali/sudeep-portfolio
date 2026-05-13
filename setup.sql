-- ================================================================
--  Sudeep Portfolio - Complete MySQL Setup
--  Run: mysql -u root -p < setup.sql
--  Password: @Sudeep123
-- ================================================================

CREATE DATABASE IF NOT EXISTS sudeep_portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sudeep_portfolio;

-- ----------------------------------------------------------------
--  DROP TABLES (clean start)
-- ----------------------------------------------------------------
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS admin_users;

-- ----------------------------------------------------------------
--  CREATE TABLES
-- ----------------------------------------------------------------

CREATE TABLE admin_users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL DEFAULT 'Sudeep P',
  title      VARCHAR(200) NOT NULL DEFAULT 'AI/ML Engineer',
  bio        TEXT,
  email      VARCHAR(150),
  phone      VARCHAR(50),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE links (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  label      VARCHAR(100) NOT NULL,
  url        VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE skills (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  category   VARCHAR(100) NOT NULL,
  skill      VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  stack       VARCHAR(300),
  description TEXT,
  status      ENUM('complete','ongoing') DEFAULT 'complete',
  url         VARCHAR(500),
  sort_order  INT DEFAULT 0
);

CREATE TABLE education (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  degree     VARCHAR(200),
  school     VARCHAR(200) NOT NULL,
  place      VARCHAR(200),
  score      VARCHAR(50),
  year       VARCHAR(50),
  sort_order INT DEFAULT 0
);

CREATE TABLE certifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  issued_by  VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE achievements (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  issued_by  VARCHAR(100),
  rank_badge VARCHAR(50),
  sort_order INT DEFAULT 0
);

-- ----------------------------------------------------------------
--  INSERT DATA
-- ----------------------------------------------------------------

-- Admin: username=admin  password=admin123
INSERT INTO admin_users (username, password) VALUES
('admin', '$2b$10$J5eouBiuUhAJIbTSPHLdFuuHSxeFvdmlRIN0Jc.exmmnN41ZyLh3y');

-- Profile
INSERT INTO profile (name, title, bio, email, phone) VALUES
(
  'Sudeep P',
  'AI/ML Engineer · Full-Stack Developer',
  'Aspiring AI/ML engineer and full-stack developer with a strong foundation in programming, web development, and machine learning. Passionate about building intelligent solutions that solve real-world problems.',
  'sudeep.patali1@gmail.com',
  '+91-7619554344'
);

-- Links
INSERT INTO links (label, url, sort_order) VALUES
('LinkedIn',  'https://www.linkedin.com/in/sudeep-patali-259671297', 1),
('Portfolio', 'https://sudeep-patali.github.io/SudeepP-portfolio/',  2),
('GitHub',    'https://github.com/sudeep-patali',                    3);

-- Skills
INSERT INTO skills (category, skill, sort_order) VALUES
('Programming Languages', 'C',                  1),
('Programming Languages', 'Java',               2),
('Programming Languages', 'Python',             3),
('Web Development',       'HTML',               1),
('Web Development',       'CSS',                2),
('Web Development',       'JavaScript',         3),
('Web Development',       'PHP',                4),
('Web Development',       'React',              5),
('Web Development',       'Node.js',            6),
('Database',              'MySQL',              1),
('AI / ML',               'Machine Learning',   1),
('AI / ML',               'Deep Learning',      2),
('AI / ML',               'Image Processing',   3),
('AI / ML',               'Data Analysis',      4),
('Soft Skills',           'Problem Solving',    1),
('Soft Skills',           'Creativity',         2),
('Soft Skills',           'Adaptability',       3),
('Soft Skills',           'Team Collaboration', 4);

-- Projects
INSERT INTO projects (name, stack, description, status, url, sort_order) VALUES
(
  'NodeX - Digital No-Due Clearance System',
  'Full-Stack Web Development',
  'Digitised the institutional no-due clearance process to eliminate paperwork and enable faster multi-department approvals. Designed separate interfaces for students and administrators.',
  'complete', '', 1
),
(
  'CRC-ID - Colorectal Cancer Classification',
  'Python, Deep Learning, Medical Image Processing',
  'Applying machine learning and deep learning to identify and classify colorectal cancer based on tissue invasion depth. Focus on medical image processing and diagnostic accuracy.',
  'ongoing', '', 2
);

-- Education
INSERT INTO education (degree, school, place, score, year, sort_order) VALUES
(
  'Bachelor of Engineering (CSE)',
  'Vivekananda College of Engineering & Technology',
  'Puttur, Karnataka', '9.47 CGPA', '2023 - 2027', 1
),
(
  'Pre-University College (PCMB)',
  'Narendra Pre-University College',
  'Tenkila, Puttur', '94.67%', '2021 - 2023', 2
),
(
  'SSLC (10th)',
  'Vivekananda English Medium School',
  'Tenkila, Puttur', '88%', '2021', 3
);

-- Certifications
INSERT INTO certifications (name, issued_by, sort_order) VALUES
('The Joy of Computing Using Python',    'NPTEL',               1),
('HTML & CSS Web Development',           'Udemy',               2),
('Data Structures & Algorithms',         'Infosys Springboard', 3),
('Object-Oriented Programming with C++', 'Infosys Springboard', 4);

-- Achievements
INSERT INTO achievements (title, issued_by, rank_badge, sort_order) VALUES
('LeetCode 600+ Points',              'LeetCode',     '600+',   1),
('Google Cloud Arcade',               'Google',       '30 pts', 2),
('1st Place - Swift Shift (Web Dev)', 'Dept. of AI',  '1st',    3),
('1st Place - Blind Coding',          'Dept. of IEEE','1st',    4);

-- ----------------------------------------------------------------
--  VERIFY
-- ----------------------------------------------------------------
SELECT 'admin_users'    AS tbl, COUNT(*) AS cnt FROM admin_users
UNION ALL
SELECT 'profile',        COUNT(*) FROM profile
UNION ALL
SELECT 'links',          COUNT(*) FROM links
UNION ALL
SELECT 'skills',         COUNT(*) FROM skills
UNION ALL
SELECT 'projects',       COUNT(*) FROM projects
UNION ALL
SELECT 'education',      COUNT(*) FROM education
UNION ALL
SELECT 'certifications', COUNT(*) FROM certifications
UNION ALL
SELECT 'achievements',   COUNT(*) FROM achievements;