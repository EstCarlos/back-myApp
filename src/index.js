const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const cors = require("cors");
const db = require("./queries");

app.use(cors());

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
app.post("/execEntradas", db.ExecEntradas);
