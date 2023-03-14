const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventary",
  password: "admin",
  port: 5432,
});

const getEntradas = (req, res) => {
  pool.query("select * from entradas", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getSalidas = (req, res) => {
  pool.query("select * from salidas", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getProductos = (req, res) => {
  pool.query("select * from productos", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const ExecEntradas = (req, res) => {
  const {
    fecha,
    idProducto,
    producto,
    precio,
    suplidor,
    cantidad,
    encargado,
    usuario,
    plaza,
    costo,
  } = req.body;

  pool.query(
    "CALL registrar_entrada($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [
      fecha,
      idProducto,
      producto,
      precio,
      suplidor,
      cantidad,
      encargado,
      usuario,
      plaza,
      costo,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getEntradas,
  getSalidas,
  getProductos,
  ExecEntradas,
};
