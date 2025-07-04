# IP Configuration Guide for DVSI App

## Problem
The PC's IP address changes frequently (e.g., from 192.168.1.18 to 192.168.1.XX), causing the app to stop working on the network.

## Solution
We've implemented an automatic IP detection and configuration system.

## How to Update IP Configuration

### Method 1: Automatic Update (Recommended)
1. Double-click `update-ip.bat` in the project root folder
2. The script will:
   - Detect your current IP address
   - Update all necessary configuration files
   - Show you the new network URL

### Method 2: Manual Update
If the automatic method doesn't work:

1. Find your current IP address:
   - Open Command Prompt
   - Type `ipconfig`
   - Look for "IPv4 Address" under your active network adapter

2. Update the following files:
   - `client/.env`:
     ```
     REACT_APP_API_URL=http://YOUR_IP:5000
     REACT_APP_SOCKET_URL=http://YOUR_IP:5000
     ```
   - `server/.env`:
     ```
     CLIENT_URL=http://YOUR_IP:3000
     ```

3. Restart both backend and frontend servers

## Starting the Application

After updating the IP:

1. Start Backend:
   ```
   cd server
   npm start
   ```

2. Start Frontend (in a new terminal):
   ```
   cd client
   npm start
   ```

3. The backend console will display:
   - Local access URL (for your PC)
   - Network access URL (for other devices)

## Network Access
- Your PC: `http://localhost:3000`
- Other devices: `http://YOUR_IP:3000`

## Troubleshooting

### If colleagues can't access the app:
1. Ensure Windows Firewall allows port 5000
2. Run `update-ip.bat` to refresh configuration
3. Check that both PCs are on the same network
4. Clear browser cache on colleague's device

### If Google Maps doesn't work:
Update Google Cloud Console with the new IP address in API restrictions

## Note
The CORS configuration now automatically accepts any IP from the 192.168.x.x range, so the app will work with any local network IP without manual CORS updates.
