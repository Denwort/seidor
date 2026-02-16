-- SWAPI Favorites Database Schema
-- Database: swapi_favorites
-- DBMS: MariaDB / MySQL

-- Create database (if needed)
CREATE DATABASE IF NOT EXISTS swapi_favorites
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create user and pass for app
CREATE USER 'appuser'@'%' IDENTIFIED BY 'apppass';
  GRANT ALL PRIVILEGES ON swapi_favorites.* TO 'appuser'@'%';
  FLUSH PRIVILEGES;

USE swapi_favorites;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS favorites;

-- Create favorites table
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  character_id VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  height VARCHAR(50),
  mass VARCHAR(50),
  hair_color VARCHAR(100),
  skin_color VARCHAR(100),
  eye_color VARCHAR(100),
  birth_year VARCHAR(50),
  gender VARCHAR(50),

  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_character_id (character_id),
  INDEX idx_created_at (created_at),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing (optional - comment out if not needed)
-- INSERT INTO favorites (character_id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender)
-- VALUES 
--   ('1', 'Luke Skywalker', '172', '77', 'blond', 'fair', 'blue', '19BBY', 'male', 'https://swapi.py4e.com/api/planets/1/'),
--   ('4', 'Darth Vader', '202', '136', 'none', 'white', 'yellow', '41.9BBY', 'male', 'https://swapi.py4e.com/api/planets/1/');

-- Verify table structure
DESCRIBE favorites;

-- Display initial data count
SELECT COUNT(*) as total_favorites FROM favorites;
