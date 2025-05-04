-- Create the database
CREATE DATABASE IF NOT EXISTS maplestory;

-- Use the database
USE maplestory;

-- Create the accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(13) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    email VARCHAR(50) NOT NULL,
    gm TINYINT(1) DEFAULT 0,
    banned TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 