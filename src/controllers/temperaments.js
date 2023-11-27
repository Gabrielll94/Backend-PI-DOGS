// El código importa la axios biblioteca para realizar solicitudes HTTP, carga variables de entorno desde un
// .env archivo usando dotenv y recupera API_URL de las variables de entorno.
const axios = require("axios")
require("dotenv").config()
const { API_URL } = process.env
// Definición de la getTemperamentDatafunción:
const { Temperament } = require("../db")

const getTemperamentData = async () => {
    try {
		//Obteniendo temperamentos de la base de datos:
		const temperamentsDb = await Temperament.findAll() 
// Comprobando si la base de datos tiene datos de temperamento:
		if (temperamentsDb.length) {
			return [...temperamentsDb].sort()
		} else {
			// Obteniendo temperamentos de la API para perros:
			const { data } = await axios.get(API_URL)
			// Procesamiento de datos API para perros:
			var temperaments = []
			data.map((d) => {
				let temperament = d.hasOwnProperty("temperament")
					? d.temperament.split(",")
					: []
				const trimmed = temperament.map((t) => t.trim())
				temperaments = [...temperaments, ...trimmed]
			})
			// Eliminación de duplicados y clasificación:
			const tempSet = new Set([...temperaments])
			const sorted = [...tempSet].sort()
			// Preparación de datos para la inserción de la base de datos:
			const bulk = sorted.map((t, i) => {
				return { name: t }
			})
			// Insertar datos en la base de datos:
			const temperamentsInserted = await Temperament.bulkCreate(bulk)
			return temperamentsInserted
		}
    } catch (error) { // Manejo de errores:
        console.error('getTemperamentData: ', error.message)
		throw new Error(error.message)
	}
}

module.exports = { getTemperamentData }