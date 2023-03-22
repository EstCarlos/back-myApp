const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const cors = require("cors");
const db = require("./queries");

app.use(cors());

// const allowedOrigins = [
//   "capacitor://localhost",
//   "ionic://localhost",
//   "http://localhost",
//   "http://localhost:8080",
//   "http://localhost:8100",
//   "http://localhost:3000",
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Origin not allowed by CORS"));
//     }
//   },
// };

// // Enable preflight requests for all routes
// app.options("*", cors(corsOptions));

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
app.get("/suplidor", db.getSuplidor);
app.get("/localidad", db.getLocalidad);
app.get("/usuarios", db.getUser);

app.post("/execsuplidores", db.ExecSuplidores);
app.post("/execentradas", db.ExecEntradas);
app.post("/execsalidas", db.ExecSalidas);
app.post("/registro", db.Register);
app.post("/login", db.login);
