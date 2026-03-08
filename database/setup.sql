-- Run this script in MySQL Workbench or MySQL CLI to set up the database

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS school_management;

-- Step 2: Use the database
USE school_management;

-- Step 3: Create the schools table
CREATE TABLE IF NOT EXISTS schools (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    address     VARCHAR(500)   NOT NULL,
    latitude    FLOAT          NOT NULL,
    longitude   FLOAT          NOT NULL,
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- Step 4 (Optional): Insert sample data to test
INSERT INTO schools (name, address, latitude, longitude) VALUES
('Delhi Public School', 'Sector 45, Gurugram, Haryana', 28.4089, 77.0421),
('Kendriya Vidyalaya', 'IIT Campus, Hauz Khas, New Delhi', 28.5459, 77.1926),
('St. Xavier School', 'Civil Lines, Nagpur, Maharashtra', 21.1458, 79.0882),
('Ryan International School', 'Malad West, Mumbai, Maharashtra', 19.1872, 72.8484),
('The Heritage School', 'Kolkata, West Bengal', 22.5726, 88.3639);
