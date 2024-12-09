const express = require("express");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

let concesionarios = [
  {
    nombre: "Concesionario Cádiz",
    direccion: "Av. Principal, Cádiz",
    coches: [
      { modelo: "Opel Corsa", cv: 90, precio: 15000 },
      { modelo: "Renault Megane", cv: 120, precio: 20000 },
    ],
  },
];

// Obtener todos los concesionarios
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

// Crear un nuevo concesionario
app.post("/concesionarios", (req, res) => {
  concesionarios.push(req.body);
  res.json({ message: "Concesionario creado" });
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios[id];
  if (concesionario) {
    res.json(concesionario);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (concesionarios[id]) {
    concesionarios[id] = req.body;
    res.json({ message: "Concesionario actualizado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borrar un concesionario por ID
app.delete("/concesionarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (concesionarios[id]) {
    concesionarios = concesionarios.filter((_, index) => index !== id);
    res.json({ message: "Concesionario eliminado" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener los coches de un concesionario
app.get("/concesionarios/:id/coches", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios[id];
  if (concesionario) {
    res.json(concesionario.coches);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios[id];
  if (concesionario) {
    concesionario.coches.push(req.body);
    res.json({ message: "Coche añadido" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = parseInt(req.params.id);
  const cocheId = parseInt(req.params.cocheId);
  const concesionario = concesionarios[id];
  if (concesionario && concesionario.coches[cocheId]) {
    res.json(concesionario.coches[cocheId]);
  } else {
    res.status(404).json({ message: "Coche no encontrado" });
  }
});

// Actualizar un coche de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = parseInt(req.params.id);
  const cocheId = parseInt(req.params.cocheId);
  const concesionario = concesionarios[id];
  if (concesionario && concesionario.coches[cocheId]) {
    concesionario.coches[cocheId] = req.body;
    res.json({ message: "Coche actualizado" });
  } else {
    res.status(404).json({ message: "Coche no encontrado" });
  }
});

// Borrar un coche de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = parseInt(req.params.id);
  const cocheId = parseInt(req.params.cocheId);
  const concesionario = concesionarios[id];
  if (concesionario && concesionario.coches[cocheId]) {
    concesionario.coches = concesionario.coches.filter(
      (_, index) => index !== cocheId
    );
    res.json({ message: "Coche eliminado" });
  } else {
    res.status(404).json({ message: "Coche no encontrado" });
  }
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
