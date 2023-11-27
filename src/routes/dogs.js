const { Router } = require("express")
const {
	getAllData,
	getByIdRaza,
	addNewBreed,
	deleteDbBreed,
} = require("../controllers/dogs")

// Este código define un conjunto de rutas para un servidor web que realiza operaciones CRUD
//  (Crear, Leer, Actualizar, Eliminar) en datos de razas de perros, utilizando funciones importadas desde el módulo
//   "../controllers/dogs".

const server = Router() // Se crea una instancia de Routerque se utilizará para definir las rutas del servidor.

//  GET /dogs
//  GET /dogs?name="..."
server.get("/", async (req, res, next) => { // Esta ruta maneja las peticiones GET a la raíz del servidor ("/dogs").
	try {
		const { name } = req.query
        const dogsData = await getAllData(name)
		res.status(200).send(dogsData)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

// GET /dogs/{idRaza}
server.get("/:idRaza", async (req, res) => {
	try {
		const { idRaza } = req.params
        const dogsData = await getByIdRaza(idRaza) // Utiliza la función getByIdRaza para obtener datos de la raza de
		// perros con el ID proporcionado.
		res.status(200).send(dogsData)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

// POST /dogs
server.post("/", async (req, res) => {
    try {
		// Extrae datos del cuerpo de la solicitud
		console.log(req.body);
        const { name, heightMin, heightMax, weightMin, weightMax, lifeSpan, image, temperaments } = req.body;
		// Verifica que todos los campos requeridos estén presentes
        if (!name || !heightMin || !heightMax || !weightMin || !weightMax || !lifeSpan || !image || !temperaments) {
            return res.status(400).send("Must complete all required fields");
        }

        
		// Registra los datos de la nueva raza de perro
        const response = await addNewBreed({ name, heightMin, heightMax, weightMin, weightMax, lifeSpan, image, temperaments });
        return res.status(200).send(response);
    } catch (error) {
		// Manejo de errores
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// DELETE /dogs
server.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params
        await deleteDbBreed(id)
        res.sendStatus(200)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

module.exports = server
