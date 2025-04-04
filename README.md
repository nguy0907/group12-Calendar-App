# Calendar Application
Contained in this README is the breakdown of the project structure.

## How to clone 
First, go into an empty folder on your computer somewhere.
```
git clone https://github.com/nguy0907/group12-Calendar-App.git`
```

## Node Server
This project uses Node. In order to install node, please: 
1. Go to: https://nodejs.org/en/download
2. Select the proper OS dropdown for your machine
3. Select version 23.11.0, select "fnm" for the installer, and npm for the package manager.
4. Follow the terminal instructions to install Node on your machine.

## MySQL Setup
This project requires a MySQL server running on the same machine (localhost).
1. Go to: https://dev.mysql.com/downloads/mysql/
2. Download MySQL Community Server, 9.2.0 Innovation version
3. Install the program, then connect to the database as the initial root user
4. Run the DDL file in the project first on the new mysql installation
5. Run the DML file once the DDL file has succeeded

## How to Run
Once both Node and MySQL have been installed and the MySQL server is running, in your terminal, open the repository folder where server.js is located, and run in your terminal:

`npm install`

This command will install all the required packages the backend server depends on automatically. Once this is done, run:

`node server.js`

From here, you can access the routes via http://localhost:3000/routenames.

## Application Structure

The application is structured into folders and files.

The .gitignore file causes github to ignore the following folders:
.vscode
node_modules
.git

As these contain IDE configuration settings, application package data, and git repo data.

### public folder
The public folder contains the HTML and CSS pages to be served as the frontend.

### package/package-lock
The package.json and package-lock.json files contain configuration data for the application and a list of package dependencies required 

### server.js
This is the javascript file where all the code for the backend server resides.
