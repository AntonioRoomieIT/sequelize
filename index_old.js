const express = require('express');
const mysql = require('mysql');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./cloud-sql-dev.json"; 

app.get('/read', (req, res) => {

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const query = 'SELECT * FROM clientes';

  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.status(200).send(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
