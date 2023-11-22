const { Router } = require("express")
const { getTemperamentData } = require("../controllers/temperaments")

const server = Router()

// GET /temperaments
server.get("/", async (req, res, next) => {
	try {
		const temperamentData = await getTemperamentData()
		res.status(200).send(temperamentData)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

module.exports = server