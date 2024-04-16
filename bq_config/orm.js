const {
  BigQuery
} = require('@google-cloud/bigquery');

// ...resto de tu código de la clase BigQueryORM 

class BigQueryORM {
  constructor(datasetId, tableId) {
    this.datasetId = datasetId;
    this.tableId = tableId;
    this.client = new BigQuery({
      projectId: process.env.PROJECT_ID,
    });
  }

  async insert(idName, id, data) {
    const dataset = this.client.dataset(this.datasetId);
    const table = dataset.table(this.tableId);
    const claves = Object.keys(data);
    const valores = Object.values(data);
    const valuesParsed = valores.map(elemento => `"${elemento}"`).join(',');
    const keysParsed=claves.map(elemento => `"${elemento}"`).join(',');
    //    ("${idName}",${keysParsed})
    const consultaSql = `
    INSERT INTO \`${this.datasetId}.${this.tableId}\`

    VALUES
    (${id},${valuesParsed})
  `;
    console.debug(consultaSql);
    const resultado = await table.query(consultaSql);
    return resultado;
  }

  async readAll() {
    const dataset = this.client.dataset(this.datasetId);
    const table = dataset.table(this.tableId);
    const query = `SELECT * FROM \`${this.datasetId}.${this.tableId}\``;
    console.debug(query);
    const rows = await table.query(query);
    return rows[0].map(({
      ...row
    }) => row);
  }

  async readById(idName, id) {
    const dataset = this.client.dataset(this.datasetId);
    const table = dataset.table(this.tableId);
    const query = `SELECT * FROM \`${this.datasetId}.${this.tableId}\`` + ` WHERE ${idName} = ${id}`
    console.debug(query);
    const rows = await table.query(query);
    return rows[0].map(({
      ...row
    }) => row);
  }

  async update(idName,id,data) {
    const dataset = this.client.dataset(this.datasetId);
    const table = dataset.table(this.tableId);
    const forQuery = Object.entries(data).map(([key, value]) => ` ${key} = "${value}" `).join(',\n');
    const query = `UPDATE \`${this.datasetId}.${this.tableId}\` SET ${forQuery} WHERE ${idName} = ${id}`;
    console.log(query);
    const response= await table.query(query);
    return response;
  }

  async delete(idName,id) {
    const dataset = this.client.dataset(this.datasetId);
    const table = dataset.table(this.tableId);
    const query = `DELETE FROM \`${this.datasetId}.${this.tableId}\` WHERE ${idName} = ${id}`;
    console.debug(query);
    const response=await table.query(query);
    return response;
  }
}


module.exports = BigQueryORM;