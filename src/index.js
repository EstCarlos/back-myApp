require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const db = require("./queries");

app.use(cors());

const allowedOrigins = [
  "http://localhost",
  "http://localhost:8080",
  "http://localhost:8100",
  "http://localhost:3000",
  "http://10.10.16.163:4000/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
};

// Enable preflight requests for all routes
app.options("*", cors(corsOptions));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});

app.get("/entradas", db.getEntradas);
app.get("/salidas", db.getSalidas);
app.get("/productos", db.getProductos);
app.get("/productos/:codigo_producto", db.getProductosByCodigo);

app.get("/stock", db.Stock);
app.get("/suplidor", db.getSuplidor);
app.get("/localidad", db.getLocalidad);
app.get("/usuarios", db.getUser);

app.post("/execsuplidores", db.ExecSuplidores);
app.post("/execentradas", db.ExecEntradas);
app.post("/execsalidas", db.ExecSalidas);
app.post("/registro", db.Register);
app.post("/login", db.login);

app.delete("/suplidores/:id_suplidor", db.EliminarProductos);
