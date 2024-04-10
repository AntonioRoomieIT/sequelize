const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');


require('dotenv').config();

const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
const port = process.env.PORT || 3000;

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./cloud-sql-dev.json";

// Sequelize Connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
});

// Define the Cliente model
const Cliente = sequelize.define('clientes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    correo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    telefono: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    ciudad: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false // Ensure this is set to false if you don't want timestamps
});

// Sync the model with the database (creates the table if it doesn't exist)
sequelize.sync();

// **CRUD Endpoints**

// CREATE
app.post('/createClient', async (req, res) => {
    try {
        console.log(req.body);
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// READ (Get all)
app.get('/readAllClients', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// READ (Get by ID)
app.get('/readClients/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// UPDATE
app.put('/updateClient/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            await cliente.update(req.body);
            res.json(cliente);
        } else {
            res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// DELETE
app.delete('/deleteClient/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (cliente) {
            await cliente.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({
                error: 'Cliente no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});