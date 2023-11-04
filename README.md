# Product Information Retrieval System

This project aims to create a Product Information Retrieval System that leverages a MySQL database and a socket server. The system allows users to fetch product details based on their selection of "X" or "M" through a simple web page.

## Features

1. **MySQL Database Creation:** We have provided an SQL script, `create_db.sql`, that helps you create the necessary MySQL database and tables using data from the "urunler.json" file.

2. **Data Import to Database:** A Python script, `import_data.py`, is included to import the product data from the "urunler.json" file into the MySQL database. Ensure you provide your database connection details in the script.

3. **Socket Server:** We have implemented a Python socket server, `socket_server.py`, which listens for incoming connections and handles requests for product information.

4. **Web Page:** A simple web page, "index.html," is provided with two buttons labeled "X" and "M." These buttons are used to send requests to the socket server for product information.

5. **Socket Communication:** The JavaScript file, "socket.js," establishes a connection to the socket server. When the "X" or "M" button is clicked, it sends the respective value to the socket server for processing.

6. **Socket Response:** The socket server, upon receiving an "X" or "M" request, queries the MySQL database for the corresponding product information and sends it back to the web page for display.

## Project Setup and Usage

1. Clone the repository:
   ```bash
   git clone <repository_url>
