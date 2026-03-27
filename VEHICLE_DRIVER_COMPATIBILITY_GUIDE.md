# Vehicle-Driver Compatibility Setup Guide

## Overview
This update implements vehicle-driver compatibility in the Dispatch page. When creating a trip, after selecting a vehicle, only drivers qualified for that vehicle type will be shown.

## Changes Made

### 1. Database Updates
**File:** `database-update-drivers.sql`

The script adds a `vehicle_type` column to the drivers table and assigns compatible vehicle types to existing drivers:
- Kamal Perera → Lorry
- Sunil Silva → Van
- Nimal Fernando → Lorry
- Priyantha Raj → Motorcycle
- Amal Jayasinghe → Van
- Saman Kumara → Truck

### 2. Backend API Updates
**File:** `backend/routes/drivers.js`

- Added query parameter support for filtering drivers by `vehicle_type`
- Updated CREATE endpoint to accept `vehicle_type`
- Updated UPDATE endpoint to modify `vehicle_type`

### 3. Frontend Updates

#### Dispatch.jsx
- Added `filteredDrivers` state to store compatible drivers
- Added `useEffect` hook that automatically filters drivers when a vehicle is selected
- Updated driver dropdown to show only compatible drivers with their vehicle type
- Shows helpful messages like "Select vehicle first" or "No compatible drivers"

#### DriverManagement.jsx
- Added `vehicle_type` field to driver form data
- Added vehicle type selector (Lorry, Van, Motorcycle, Truck)
- Updated driver table to display vehicle type column
- Both Add and Edit dialogs now include vehicle type selection

## Setup Instructions

### Step 1: Update Database
Run the database update script in MySQL Workbench:

```sql
-- Execute this file
database-update-drivers.sql
```

Or manually run these commands:
```sql
USE logilink_360;

ALTER TABLE drivers 
ADD COLUMN vehicle_type VARCHAR(50) AFTER license_number;

UPDATE drivers SET vehicle_type = 'Lorry' WHERE id = 1;
UPDATE drivers SET vehicle_type = 'Van' WHERE id = 2;
UPDATE drivers SET vehicle_type = 'Lorry' WHERE id = 3;
UPDATE drivers SET vehicle_type = 'Motorcycle' WHERE id = 4;
UPDATE drivers SET vehicle_type = 'Van' WHERE id = 5;
UPDATE drivers SET vehicle_type = 'Truck' WHERE id = 6;
```

### Step 2: Restart Backend Server
Stop and restart your Node.js backend server to apply API changes:

```bash
cd backend
node server.js
```

### Step 3: Test the Feature

1. **Start the application:**
   ```bash
   # In one terminal (backend)
   cd backend
   node server.js
   
   # In another terminal (frontend)
   cd logilink-360
   npm run dev
   ```

2. **Navigate to Fleet Management:**
   - Add a new vehicle (e.g., "Lorry-004" with type "Lorry")

3. **Navigate to Driver Management:**
   - Verify you can see the "Vehicle Type" column
   - Add a new driver and select a vehicle type
   - Edit an existing driver to change their vehicle type

4. **Navigate to Dispatch Page:**
   - Click "Create Trip"
   - Select a vehicle (e.g., "Lorry-001" - Lorry)
   - The driver dropdown should now show ONLY drivers with "Lorry" vehicle type
   - You should see driver names with their vehicle type in parentheses

5. **Test Different Scenarios:**
   - Select different vehicle types and verify driver filtering
   - Try "Van" vehicles → should show Van-qualified drivers only
   - Try "Motorcycle" vehicles → should show Motorcycle-qualified drivers only
   - Clear vehicle selection → should reset driver selection

## How It Works

### Automatic Filtering Logic

1. **When a vehicle is selected:**
   - The system finds the selected vehicle's type (e.g., "Lorry")
   - Filters all active drivers to show only those with matching `vehicle_type`
   - Updates the driver dropdown with compatible drivers

2. **Driver Reset:**
   - If a driver was already selected
   - And the vehicle type changes to something incompatible
   - The driver selection is automatically cleared

3. **Visual Feedback:**
   - Driver dropdown shows placeholder: "Select vehicle first" (no vehicle selected)
   - Or "Select compatible driver" (vehicle selected)
   - Or "No compatible drivers" (no drivers match the vehicle type)

## Example Usage

### Creating a Trip for Lorry
1. Click "Create Trip"
2. Select Vehicle: "Lorry-001 - Lorry (5000kg)"
3. Driver dropdown shows:
   - Kamal Perera (Lorry)
   - Nimal Fernando (Lorry)
4. Select driver and complete trip creation

### Creating a Trip for Van
1. Click "Create Trip"
2. Select Vehicle: "Van-001 - Van (1500kg)"
3. Driver dropdown shows:
   - Sunil Silva (Van)
   - Amal Jayasinghe (Van)
4. Select driver and complete trip creation

## Benefits

✅ **Safety Compliance** - Only qualified drivers operate specific vehicle types
✅ **User Experience** - No manual filtering needed, automatic updates
✅ **Error Prevention** - Can't accidentally assign wrong driver to vehicle
✅ **Clear Feedback** - Visual indicators show why certain drivers aren't available
✅ **Easy Management** - Update driver qualifications in Driver Management page

## Troubleshooting

### Issue: Drivers not showing after selecting vehicle
**Solution:** 
- Check if drivers have `vehicle_type` assigned in database
- Run the database update script again
- Verify backend server is running

### Issue: "No compatible drivers" message
**Solution:**
- Go to Driver Management
- Edit existing drivers and assign appropriate vehicle types
- Or add new drivers with the required vehicle type

### Issue: Old driver data still appears
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check if backend API changes are deployed

## Future Enhancements

Potential improvements for future versions:
- Multiple vehicle type qualifications per driver
- Driver certification tracking
- Automatic assignment suggestions based on availability
- Vehicle type hierarchy (e.g., Truck drivers can also drive Vans)
