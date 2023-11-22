const axios = require("axios")
require("dotenv").config()
const { API_URL } = process.env

const { Temperament } = require("../db")

const getTemperamentData = async () => {
    try {
		// get temperaments from DB
		const temperamentsDb = await Temperament.findAll()

		if (temperamentsDb.length) {
			return [...temperamentsDb].sort()
		} else {
			// get temperaments from DOG API
			const { data } = await axios.get(API_URL)

			var temperaments = []
			data.map((d) => {
				let temperament = d.hasOwnProperty("temperament")
					? d.temperament.split(",")
					: []
				const trimmed = temperament.map((t) => t.trim())
				temperaments = [...temperaments, ...trimmed]
			})

			const tempSet = new Set([...temperaments])
			const sorted = [...tempSet].sort()

			const bulk = sorted.map((t, i) => {
				return { name: t }
			})

			const temperamentsInserted = await Temperament.bulkCreate(bulk)
			return temperamentsInserted
		}
    } catch (error) {
        console.error('getTemperamentData: ', error.message)
		throw new Error(error.message)
	}
}

module.exports = { getTemperamentData }