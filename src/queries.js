const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

const Stock = (req, res) => {
  pool.query(
    `SELECT p.codigo_producto, p.nombre_producto, s.nombre_suplidor, pl.nombre_local, p.inventario_actual, p.fecha
    FROM Productos p
    JOIN suplidor s ON p.id_suplidor = s.id_suplidor
    JOIN localidad pl ON p.id_plaza = pl.id_plaza
    `,
    (error, results) => {
      if (error) {
        // Envia una respuesta de error con un mensaje y un código HTTP 500
        res.status(500).json({ message: "Error al ejecutar al cargar" });
        return;
      }
      res.status(200).json(results.rows);
    }
  );
};

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

const getProductosByCodigo = (req, res) => {
  const codigo_producto = req.params.codigo_producto;

  pool.query(
    "SELECT * FROM productos WHERE codigo_producto = $1",
    [codigo_producto],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
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
    codigo_producto,
    fecha,
    producto,
    precio,
    id_suplidor,
    id_plaza,
    cantidad,
    encargado_entrega,
    quien_registra,
    costo_por_unidad,
  } = req.body;

  pool.query(
    "CALL registrar_entrada ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [
      codigo_producto,
      fecha,
      producto,
      precio,
      id_suplidor,
      id_plaza,
      cantidad,
      encargado_entrega,
      quien_registra,
      costo_por_unidad,
    ],
    (error, results) => {
      if (error) {
        // Envia una respuesta de error con un mensaje y un código HTTP 500
        res.status(500).json({ message: "Error al ejecutar la consulta" });
        return;
      }
      res.status(200).json(results.rows);
    }
  );
};

const ExecSalidas = (req, res) => {
  const {
    codigo_producto,
    fecha,
    id_suplidor,
    id_plaza,
    producto,
    cantidad,
    precio_unitario,
    precio_total,
  } = req.body;

  pool.query(
    "CALL registrar_salida($1, $2, $3, $4, $5, $6, $7, $8);",
    [
      codigo_producto,
      fecha,
      id_suplidor,
      id_plaza,
      producto,
      cantidad,
      precio_unitario,
      precio_total,
    ],
    (error, results) => {
      if (error) {
        // Envia una respuesta de error con un mensaje y un código HTTP 500
        res.status(500).json({ message: "Error al ejecutar la consulta" });
        return;
      }
      res.status(200).json(results.rows);
    }
  );
};

const Register = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const userExist = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (userExist.rows.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el nuevo usuario en la base de datos
    const newUser = await pool.query(
      "INSERT INTO usuarios (nombre_user, apellido_user, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, apellido, email, hashedPassword]
    );

    // Crear y enviar el token JWT con la información del usuario
    const token = jwt.sign(
      {
        id: newUser.rows[0].id_user,
        nombre: newUser.rows[0].nombre_user,
        apellido: newUser.rows[0].apellido_user,
        email: newUser.rows[0].email,
      },
      "HoratioHire$&@2015",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ mensaje: "El usuario no existe" });
    }

    // Verificar si la contraseña es correcta
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    // Crear y enviar el token JWT con la información del usuario
    const token = jwt.sign(
      {
        id: user.rows[0].id_user,
        nombre: user.rows[0].nombre_user,
        apellido: user.rows[0].apellido_user,
        email: user.rows[0].email,
        fullName: `${user.rows[0].nombre_user} ${user.rows[0].apellido_user}`,
      },
      "HoratioHire$&@2015",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: `${user.rows[0].nombre_user} ${user.rows[0].apellido_user}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const EliminarProductos = async (req, res) => {
  const { id_suplidor } = req.params;

  pool.query("CALL eliminar_registro($1)", [id_suplidor], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json({ mensaje: "Eliminado exitosamente" });
  });
};

module.exports = {
  getEntradas,
  getSalidas,
  getProductos,
  getProductosByCodigo,
  ExecEntradas,
  ExecSalidas,
  getSuplidor,
  getLocalidad,
  getUser,
  ExecSuplidores,
  Register,
  login,
  Stock,
  EliminarProductos,
};
