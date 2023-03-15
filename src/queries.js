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

const getSuplidor = (req, res) => {
  pool.query("select * from suplidor", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getLocalidad = (req, res) => {
  pool.query("select * from localidad", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getUser = (req, res) => {
  pool.query("select * from usuarios", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const ExecSuplidores = (req, res) => {
  const { nombre_suplidor } = req.body;

  pool.query(
    "CALL registrar_suplidores($1)",
    [nombre_suplidor],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
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
  getSuplidor,
  getLocalidad,
  getUser,
  ExecSuplidores,
};
