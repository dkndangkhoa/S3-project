# Pixel Playground Knowledge Database by K2DM


## Name
Pixel Playground Knowledge Database

## Description
 This website is designed to be a comprehensive resource for individuals associated with the Pixel Playground at FICT. Whether you're a student, teacher, or visitor, this platform offers valuable insights and tutorials to enhance your experience in the virtual production domain.

 ### Features:

- **Lab Information:** Explore information about the Pixel Playground and available equipment.
  
- **Tutorials:** Access a curated collection of tutorials covering various aspects of the lab's equipment. The tutorials are designed to support users at every skill level.


## Installation

### USING THE WEBSITE: A Step-by-Step Guide

For step-by-step instructions with pictures, refer to the "Advice for Stakeholders" document available in the project repository.

-   **STEP 1**

Unzip the Project Files

-   **STEP 2**

Open the Zipped Folder in VS Code and access Terminal

-   **STEP 3**

In the terminal, run the command ‘node app.js’ to start the application. This will start the server and connect to MongoDB Atlas.

-   **STEP 4**

Open your browser and navigate to http://localhost:3000/

-   **STEP 5**

Access the admin panel to add new, edit and delete tutorials.
In your browser, navigate to http://localhost:3000/admin

-   **STEP 6**
Log in to the admin panel.
The admin username and password are provided in a separate admin.txt file in the project zip file.

-   **STEP 7: Create a new post.**

1. Select tutorial category from the dropdown menu.
2. Input title of the tutorial.
3. Navigate to the video of the tutorial on Youtube, click on share, click on embed and copy the Youtube ID of the video as highlighted in the screenshot below.
4. Input a short description of the tutorial in the text field.
5. Upload pdf of the tutorial. (Please ensure to keep the file sizes moderate for efficient storage in MongoDB. Compress the PDF and consider the overall file size to enhance system performance).
6. Click ‘Create Tutorial’.


-   **STEP 8: Edit tutorials.**

1. On the ‘admin page’, click ‘Edit Tutorials’
2. To edit a tutorial, click on ‘Edit’
3. This will open a new page containing the Title and Text of the tutorial. You can make changes to these fields and click ‘Save changes’.


-   **STEP 9: Delete tutorials.**

To delete a tutorial, look for the tutorial under the category where you uploaded it and click on ‘Delete’


NB: Its not possible to change/edit the Youtube video or PDF after tutorial has been created. To do this, you must delete the tutorial and upload it again.


## Using Your Own MongoDB Account

To use your own MongoDB account with the Pixel Playground Virtual Production Lab Knowledge Database, follow these steps:

## Setting Up MongoDB Atlas for Pixel Playground

### Step 1: Sign Up for MongoDB Atlas
1. Go to the MongoDB Atlas [website](https://www.mongodb.com/cloud/atlas) and sign up for a new account.
2. Log in to your MongoDB Atlas dashboard.

### Step 2: Create a New Cluster
1. Click on the "Build a Cluster" button.
2. Choose the option to create a free-tier cluster.
3. Select a cloud provider and region.
4. Click "Create Cluster" after configuring additional options.

### Step 3: Configure Security Settings
#### Create a Database User:
1. Navigate to the "Security" section and select "Database Access."
2. Click "Add New Database User."
3. Choose a username and a secure password. Save these credentials.
4. Grant appropriate privileges (e.g., "Read and write to any database").
5. Click "Add User" to create the user.

#### Whitelist Your IP Address:
1. In the "Security" section, select "Network Access."
2. Click "Add IP Address."
3. Add only your current IP address for security.
4. Click "Confirm."

### Step 4: Connect to Your Cluster
1. Click on "Clusters" in the left sidebar.
2. In your cluster's overview, click on "CONNECT."
3. Choose "Connect your application."
4. Select your driver version and copy the provided connection string.

**Note: Save your credentials securely, as they will be needed to connect to your database.**

**Update .env File:**
   - In the project's root directory, locate the `.env` file.
   - Update the `MONGO_URI` variable with your MongoDB connection string.
  
   ```env
   MONGO_URI=your-mongodb-connection-string
   ```
Replace `your_mongodb_connection_string` with the actual connection string provided
by MongoDB Atlas. Make sure to include your password and the database name you want to
connect to.

## Authors and acknowledgment

This project was made possible through the collaborative efforts of the following team members:

1. [Nguyen, Dang Khoa] - Student Number: [I458834]
2. [Izekor Kingsley] - Student Number: [I503216]
3. [Matthew Marvel Tendean] - Student Number: [I500685]
4. [Umoru Donald] - Student Number: [I481799]


## Project status

While the current version of the project represents a functional and complete state, there are opportunities for future improvements and enhancements. Some areas to consider for future development include:

1. **User Authentication:** Implement a more robust and secure user authentication system, moving away from hardcoded credentials to enhance security.

2. **Dynamic Content Management:** Extend the content management system (CMS) capabilities to allow users to dynamically add new categories directly through the admin panel.

3. **Enhanced User Interface (UI):** Refine and enhance the user interface to be responsive across more devices/screens for a more visually appealing experience. 
