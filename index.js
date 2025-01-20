const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//HELMET
const helmet = require("helmet");

const uri =
  "mongodb+srv://franciscojosesanchezlloret:xzjPV6zXZPpohatw@cluster0.silp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  helmet({
    hidePoweredBy: true, // Oculta la cabecera X-Powered-By
    frameguard: { action: "deny" }, // Previene que tu app sea embebida en un iframe
  })
);

const port = process.env.PORT || 8080;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, concesionariosCollection;

async function run() {
  try {
    await client.connect();
    db = client.db("concesionariosDB"); // Nombre de la base de datos
    concesionariosCollection = db.collection("concesionarios"); // Colección

    console.log("Conectado a MongoDB!");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
  }
}
run().catch(console.dir);

// Obtener todos los concesionarios
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await concesionariosCollection.find().toArray();
    res.json(concesionarios);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los concesionarios", error: err });
  }
});

// Crear un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  try {
    const nuevoConcesionario = req.body;
    const result = await concesionariosCollection.insertOne(nuevoConcesionario);
    res.json({ message: "Concesionario creado", id: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear el concesionario", error: err });
  }
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const concesionario = await concesionariosCollection.findOne({ _id: id });
    if (concesionario) {
      res.json(concesionario);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el concesionario", error: err });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const actualizacion = req.body;
    const result = await concesionariosCollection.updateOne(
      { _id: id },
      { $set: actualizacion }
    );
    if (result.matchedCount > 0) {
      res.json({ message: "Concesionario actualizado" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar el concesionario", error: err });
  }
});

// Borrar un concesionario por ID
app.delete("/concesionarios/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await concesionariosCollection.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      res.json({ message: "Concesionario eliminado" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el concesionario", error: err });
  }
});

// Obtener los coches de un concesionario
app.get("/concesionarios/:id/coches", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const concesionario = await concesionariosCollection.findOne({ _id: id });
    if (concesionario) {
      res.json(concesionario.coches || []);
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los coches", error: err });
  }
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const coche = req.body;
    const result = await concesionariosCollection.updateOne(
      { _id: id },
      { $push: { coches: coche } }
    );
    if (result.matchedCount > 0) {
      res.json({ message: "Coche añadido" });
    } else {
      res.status(404).json({ message: "Concesionario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al añadir el coche", error: err });
  }
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
