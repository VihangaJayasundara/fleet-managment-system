-- =====================================================
-- Update Drivers Table - Add Vehicle Type Compatibility
-- =====================================================

USE logilink_360;

-- Add vehicle_type column to drivers table
ALTER TABLE drivers 
ADD COLUMN vehicle_type VARCHAR(50) AFTER license_number;

-- Update existing drivers with random vehicle types for testing
UPDATE drivers SET vehicle_type = 'Lorry' WHERE id = 1; -- Kamal Perera
UPDATE drivers SET vehicle_type = 'Van' WHERE id = 2;   -- Sunil Silva
UPDATE drivers SET vehicle_type = 'Lorry' WHERE id = 3; -- Nimal Fernando
UPDATE drivers SET vehicle_type = 'Motorcycle' WHERE id = 4; -- Priyantha Raj
UPDATE drivers SET vehicle_type = 'Van' WHERE id = 5;   -- Amal Jayasinghe
UPDATE drivers SET vehicle_type = 'Truck' WHERE id = 6; -- Saman Kumara

-- Verify the changes
SELECT id, name, license_number, vehicle_type, status FROM drivers;
