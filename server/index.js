// Servidor en express
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;


// import CORS
const cors = require("cors");
app.options("*", cors())
app.use(cors());

var dotenv = require("dotenv");
dotenv.config()

// BODY PARSER
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Importar el modelo Articulo y Ticket
const Articulo = require("../models/Articulo");
const Ticket = require("../models/Ticket");

// ------------------------------- CRUD -------------------------------------//

// ARTICULOS

// Server activado
app.get("/", (req, res) => {
  res.send("SERVER");
});

// -------------------- GET --------------------
app.get("/articulos/", (req, res) => {
  Articulo.find()
    .then(item => res.status(200).send({ mensaje: "Get exitoso", res: item }))
    .catch(err => res.send({ msj: "Error en get", res: err }));
});

// -------------------- GET by ID --------------------
app.get("/articulo/:id", (req, res) => {
  Articulo.findById(req.params.id)
    .then(item => {
      item
        ? res.status(200).send({ mensaje: "Get exitoso", res: item })
        : res.status(404).send({ mensaje: "No Encontrado", res: item });
    })
    .catch(err => res.status(409).send({ msj: "Error en getById", res: err }));
});

// -------------------- POST --------------------
app.post("/crear/articulo", (req, res) => {
  console.log(req.body);
  const nuevoArticulo = new Articulo(req.body);
  nuevoArticulo.save((err, articulo) => {
    return !err
      ? res.status(201).send({ mensaje: "Articulo creado", res: articulo })
      : res.status(400).send({ msj: "Error al crear Articulo", res: err });
  });
});

// -------------------- UPDATE --------------------

app.put("/update/articulo/:id", (req, res) => {
  const idArticulo = req.params.id;
  Articulo.findByIdAndUpdate(idArticulo, { $set: req.body }, { new: true })
    .then(UpdateArticulo => res.status(200).send(UpdateArticulo))
    .catch(UpdateArticulo => res.status(400).send(UpdateArticulo));
});

// -------------------- DELETE --------------------

app.delete("/borrar/articulo/:id", (req, res) => {
  Articulo.findByIdAndRemove(req.params.id)
    .then(DeletePelicula => res.status(200).send(DeletePelicula))
    .catch(DeletePelicula => res.status(400).send(DeletePelicula));
});

// TICKETS

// -------------------- GET --------------------
app.get("/tickets/", (req, res) => {
  Ticket.find()
    .populate("articulos")
    .then(item => res.status(200).send({ mensaje: "Get exitoso", res: item }))
    .catch(err => res.send({ msj: "Error en get", res: err }));
});

// -------------------- POST --------------------
app.post("/crear/ticket", (req, res) => {
  const nuevoTicket = new Ticket(req.body);
  nuevoTicket.save((err, ticketCreado) => {
    return !err
      ? res.status(201).send({ mensaje: "Post exitoso", res: ticketCreado })
      : res.status(400).send({ msj: "Error en post del ticket", res: err });
  });
});

// -------------------- UPDATE --------------------

app.put("/update/ticket/:id", (req, res) => {
  const idTicket = req.params.id;
  Ticket.findByIdAndUpdate(idTicket, { $set: req.body }, { new: true })
    .then(UpdateTicket => res.status(200).send(UpdateTicket))
    .catch(UpdateTicket => res.status(400).send(UpdateTicket));
});

// -------------------- DELETE --------------------

app.delete("/borrar/ticket/:id", (req, res) => {
  Ticket.findByIdAndRemove(req.params.id)
    .then(DeleteTicket => res.status(200).send(DeleteTicket))
    .catch(DeleteTicket => res.status(400).send(DeleteTicket));
});

// -------------------- GET by ID -------------------- punto 3
app.get("/calculo/ticket/:id", (req, res) => {
  Ticket.findById(req.params.id)
    .populate("articulos")
    .then(item => {
      var subtotal = 0;
      var itbms = 0.07;
      var total = 0;
      item.articulos.map(articulo => {
        subtotal = subtotal + articulo.precio;
      }),
        (itbms = itbms * subtotal),
        (total = total + subtotal + itbms),
        Ticket.findByIdAndUpdate(req.params.id, {
          subtotal: subtotal,
          itbms: itbms,
          total: total
        })
          .then(UpdateTicket => res.status(200).send(UpdateTicket))
          .catch(UpdateTicket => res.status(400).send(UpdateTicket));
      // console.log(subtotal);
      // console.log(`El impuesto es ${itbms}`);
      // console.log(`El total es ${total}`);
    })
    .catch(err => res.status(409).send({ msj: "Error en getById", res: err }));
});

module.exports = { app, port };
