const { Router } = require("express")
const { getTemperamentData } = require("../controllers/temperaments")

// Establece una ruta GET en la raíz de la aplicación que, cuando se accede, intenta obtener datos de temperamentos
//  utilizando la función getTemperamentData.

const server = Router()

// GET /temperaments
server.get("/", async (req, res, next) => { // La función de controlador asociado se ejecutará cuando se haga
	// una solicitud GET a la raíz de la aplicación.
	//Dentro de la función del controlador, hay un bloque try-catch para gestionar posibles errores.
	try {
		const temperamentData = await getTemperamentData() //obtiene datos relacionados con temperamentos
		res.status(200).send(temperamentData)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

module.exports = server