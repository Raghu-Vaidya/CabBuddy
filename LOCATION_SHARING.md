# Location Sharing Feature

This document describes the location sharing functionality implemented in the ride-sharing application.

## Overview

The location sharing feature allows drivers to share their real-time location with passengers during active rides. This enhances safety and provides passengers with peace of mind by knowing the driver's current location.

## Features

### For Drivers
- **Toggle Location Sharing**: Drivers can enable/disable location sharing for their rides
- **Automatic Location Updates**: When enabled, location is automatically updated every 30 seconds
- **Manual Location Updates**: Drivers can manually update their location at any time
- **Location Visualization**: Drivers can see their own location on a map
- **Permission Handling**: Proper error handling for location permission issues

### For Passengers
- **Real-time Location View**: Passengers can see the driver's current location in real-time
- **Interactive Map**: Location is displayed on an interactive map using OpenStreetMap
- **Status Indicators**: Clear visual indicators show whether location sharing is enabled
- **Automatic Updates**: Location updates are received automatically via WebSocket connections
- **Location History**: Passengers can see when the location was last updated

## Technical Implementation

### Backend Components

#### Database Schema
- Added `locationSharing` field to the Ride model:
  - `enabled`: Boolean flag for location sharing status
  - `driverLocation`: Object containing latitude, longitude, and timestamp

#### API Endpoints
- `POST /api/rides/:id/location/toggle` - Toggle location sharing on/off (driver only)
- `POST /api/rides/:id/location/update` - Update driver's current location (driver only)
- `GET /api/rides/:id/location` - Get current driver location (passengers and driver)

#### WebSocket Integration
- Real-time location updates using Socket.IO
- Room-based messaging for ride-specific updates
- Automatic status change notifications

### Frontend Components

#### LocationSharing Component
- Main component handling location sharing functionality
- Different interfaces for drivers vs passengers
- WebSocket integration for real-time updates
- Geolocation API integration

#### LocationMap Component
- Interactive map display using OpenStreetMap
- Marker placement for driver location
- Coordinate display
- Responsive design

## Usage

### For Drivers
1. Navigate to a ride detail page for a ride you created
2. Find the "Location Sharing" section
3. Click "Start Sharing" to enable location sharing
4. Grant location permissions when prompted
5. Location will be automatically updated every 30 seconds
6. Use "Update Location Now" for immediate updates
7. Click "Stop Sharing" to disable location sharing

### For Passengers
1. Navigate to a ride detail page for a ride you've joined
2. Find the "Location Sharing" section
3. If enabled, you'll see the driver's current location on a map
4. Location updates automatically as the driver moves
5. View last update time and coordinates

## Security Considerations

- Only ride creators (drivers) can toggle location sharing
- Only ride creators can update location data
- Location data is only accessible to ride participants (driver and passengers)
- WebSocket connections are scoped to specific ride rooms
- Proper authentication required for all location-related endpoints

## Privacy Features

- Drivers have full control over when to share location
- Location sharing can be disabled at any time
- No location data is stored when sharing is disabled
- Clear visual indicators show sharing status
- Automatic cleanup when sharing is disabled

## Browser Compatibility

- Requires modern browsers with Geolocation API support
- WebSocket support required for real-time updates
- Responsive design works on mobile and desktop devices

## Future Enhancements

- Integration with Google Maps or other mapping services
- Route tracking and ETA estimation
- Location history for completed rides
- Push notifications for location updates
- Offline location caching
