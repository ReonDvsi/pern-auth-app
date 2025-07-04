\# PERN Auth App



A full-stack web application built with PostgreSQL, Express, React, and Node.js for user authentication and management.



\## What You Need to Install First



Before you can run this app, you need to install these programs on your computer:



\### 1. Install Node.js

\- Go to https://nodejs.org

\- Download the LTS version (recommended)

\- Run the installer and follow the steps

\- Keep clicking "Next" with default settings

\- \*\*How to check:\*\* Open Command Prompt and type `node --version`



\### 2. Install PostgreSQL Database

\- Go to https://www.postgresql.org/download/

\- Choose your operating system

\- Download and install PostgreSQL

\- \*\*Important:\*\* Remember the password you set for the "postgres" user

\- \*\*How to check:\*\* Open Command Prompt and type `psql --version`



\### 3. Install Git (if not already installed)

\- Go to https://git-scm.com/download

\- Download for your operating system

\- Install with default settings

\- \*\*How to check:\*\* Open Command Prompt and type `git --version`



\## Step-by-Step Setup Instructions



\### Step 1: Clone This Repository



\*\*Where to do this:\*\* Open Command Prompt

\*\*How to open Command Prompt:\*\* Press `Windows + R`, type `cmd`, press Enter



\*\*Type this command:\*\*

```bash

git clone https://github.com/ReonDvsi/pern-auth-app.git

```



\*\*Then go into the project folder:\*\*

```bash

cd pern-auth-app

```



\### Step 2: Install Backend Dependencies



\*\*Where to type:\*\* Same Command Prompt window



\*\*Type these commands:\*\*

```bash

cd server

npm install

```



\*\*What this does:\*\* Downloads all the backend packages (Express, database drivers, etc.)

\*\*Wait time:\*\* 2-3 minutes depending on your internet speed



\### Step 3: Install Frontend Dependencies



\*\*Where to type:\*\* Same Command Prompt window



\*\*Type these commands:\*\*

```bash

cd ../client

npm install

```



\*\*What this does:\*\* Downloads all the frontend packages (React, etc.)

\*\*Wait time:\*\* 2-3 minutes depending on your internet speed



\### Step 4: Set Up Your Database



\*\*Where to do this:\*\* PostgreSQL application



1\. \*\*Open pgAdmin\*\* (comes with PostgreSQL installation)

2\. \*\*Connect to your database server\*\* using the password you set during installation

3\. \*\*Create a new database:\*\*

&nbsp;  - Right-click on "Databases"

&nbsp;  - Click "Create" → "Database"

&nbsp;  - Name it: `pern\_auth\_db`

&nbsp;  - Click "Save"



\*\*Alternative using Command Prompt:\*\*

```bash

psql -U postgres

CREATE DATABASE pern\_auth\_db;

\\q

```



\### Step 5: Create Environment Files



You need to create two `.env` files with your own settings:



\#### Create Server Environment File



\*\*Where to do this:\*\* 

1\. Go to your project folder: `pern-auth-app/server`

2\. Create a new file called `.env`

3\. \*\*How to create:\*\* Right-click in the folder → New → Text Document → Rename to `.env`



\*\*Put this content in the file:\*\*

```

\# Database connection

DATABASE\_URL=postgresql://postgres:YOUR\_PASSWORD@localhost:5432/pern\_auth\_db



\# Replace YOUR\_PASSWORD with your actual PostgreSQL password

\# Example: DATABASE\_URL=postgresql://postgres:mypassword123@localhost:5432/pern\_auth\_db



\# JWT Secret (you can use any random string)

JWT\_SECRET=your\_super\_secret\_jwt\_key\_here\_12345



\# Email settings (optional - for password reset)

EMAIL\_USER=your\_email@gmail.com

EMAIL\_PASS=your\_email\_password



\# Server port

PORT=5000

```



\*\*Important:\*\* Replace `YOUR\_PASSWORD` with the actual password you set for PostgreSQL



\#### Create Client Environment File



\*\*Where to do this:\*\*

1\. Go to your project folder: `pern-auth-app/client`

2\. Create a new file called `.env`



\*\*Put this content in the file:\*\*

```

\# API URL

REACT\_APP\_API\_URL=http://localhost:5000



\# If you want to access from other devices on your network

\# REACT\_APP\_API\_URL=http://YOUR\_IP\_ADDRESS:5000

```



\### Step 6: Start the Application



You need to run both frontend and backend servers:



\#### Start Backend Server (First)



\*\*Where to type:\*\* Open Command Prompt

\*\*Navigate to server folder:\*\*

```bash

cd pern-auth-app/server

npm run dev

```



\*\*What you should see:\*\*

```

Server running on port 5000

Database connected successfully

```



\*\*Keep this window open!\*\*



\#### Start Frontend Server (Second)



\*\*Where to type:\*\* Open a NEW Command Prompt window

\*\*Navigate to client folder:\*\*

```bash

cd pern-auth-app/client

npm start

```



\*\*What should happen:\*\*

\- Your browser opens automatically

\- Shows the app at `http://localhost:3000`



\*\*Keep this window open too!\*\*



\### Step 7: Access the Application



\*\*Where to go:\*\* Open your web browser and visit:

\- `http://localhost:3000` (on your computer)

\- `http://YOUR\_IP\_ADDRESS:3000` (from other devices on your network)



\*\*To find your IP address:\*\*

\- Windows: Open Command Prompt and type `ipconfig`

\- Look for "IPv4 Address" under your network adapter



\## Common Issues and Solutions



\### Problem: "npm install" takes too long

\*\*Solution:\*\* Make sure you have a stable internet connection. It's downloading lots of files.



\### Problem: Database connection error

\*\*Solution:\*\* 

1\. Make sure PostgreSQL is running

2\. Check your password in the `.env` file

3\. Make sure the database `pern\_auth\_db` exists



\### Problem: Port already in use

\*\*Solution:\*\* 

1\. Close any other applications using ports 3000 or 5000

2\. Or change the port in your `.env` files



\### Problem: Can't access from other devices

\*\*Solution:\*\*

1\. Make sure both devices are on the same WiFi network

2\. Update the `REACT\_APP\_API\_URL` in client `.env` file to use your IP address

3\. Check your firewall settings



\## What Each Folder Contains



```

pern-auth-app/

├── client/          # React frontend application

│   ├── src/         # React components and code

│   ├── public/      # Static files (images, HTML)

│   └── package.json # Frontend dependencies

├── server/          # Node.js backend application

│   ├── controllers/ # Business logic

│   ├── models/      # Database models

│   ├── routes/      # API endpoints

│   └── package.json # Backend dependencies

└── README.md        # This file

```



\## Development Notes



\- \*\*Frontend runs on:\*\* `http://localhost:3000`

\- \*\*Backend runs on:\*\* `http://localhost:5000`

\- \*\*Database:\*\* PostgreSQL on port 5432

\- \*\*To stop servers:\*\* Press `Ctrl + C` in the Command Prompt windows



\## Need Help?



If you're stuck:

1\. Make sure you followed all steps in order

2\. Check that all required software is installed

3\. Verify your `.env` files have correct information

4\. Make sure both servers are running

5\. Check the Command Prompt windows for error messages



\## Security Note



Never share your `.env` files or upload them to GitHub - they contain sensitive information like database passwords!

