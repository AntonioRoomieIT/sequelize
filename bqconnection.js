const {
  BigQuery
} = require('@google-cloud/bigquery');
const { v4: uuidv4 } = require('uuid');
const express = require('express');

require('dotenv').config();
const bodyParser = require('body-parser');
const projectId = process.env.PROJECT_ID;
const datasetId = process.env.BQ_DATASET_ID;
const tableId = process.env.BQ_TABLE_ID;
const client = new BigQuery({
  projectId
});
const app = express();
app.use(bodyParser.json());
const BigQueryORM = require(process.env.BQ_ORM_PATH);
const orm = new BigQueryORM(datasetId, tableId, client);

// **ENDPOINT LEER**
app.get('/BQread', async (req, res) => {
  try {
    const data = await orm.readAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get('/testuuidv4',async(req,res)=>{
  console.log(uuidv4());
 return {"x":"y"}
});
// **ENDPOINT LEER POR ID ESPECIFICO**
app.get('/BQread/:userId', async (req, res) => {
  try {
    const defaultIdNameIndex = 'id';
    const userId = req.params.userId;
    const data = await orm.readById(defaultIdNameIndex, userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// **ENDPOINT CREAR**
app.post('/BQcreate', async (req, res) => {
  try {
      const data = req.body;
      const idName="id";
      const id=data?.[idName];
      delete data?.[idName];
      const response= await orm.insert(idName,id,data);
      if ("error" in response){
        res.status(500).send('Error al insertar datos');
      }else{
        res.status(201).send('Datos insertados correctamente');
      }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// **ENDPOINT ACTUALIZAR**
app.put('/BQupdate/:id', async (req, res) => {
  const idName='id';
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  console.log(id);
  const response= await orm.update(idName,id,data);

  if ("error" in response){
    res.status(500).send('Error al actualizar datos');
  }else{
    res.status(200).send('Datos actualizados correctamente');
  }
});
// **ENDPOINT ELIMINAR**
app.delete('/BQdelete/:id', async (req, res) => {
  const id = req.params.id;
  const idName="id";
  const response= await orm.delete(idName,id);
  if ("error" in response){
    res.status(500).send('Error al borrar datos');
  }else{
    res.status(200).send('Datos eliminados correctamente');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});