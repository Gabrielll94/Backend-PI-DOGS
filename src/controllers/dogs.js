const axios = require("axios"); //biblioteca popular para realizar solicitudes HTTP.
require("dotenv").config();
const { API_URL, API_KEY } = process.env; //se espera que estén definidos en las variables de entorno.

const { Dog, Temperament } = require("../db");

// Recuperación de datos API:
const getApiData = async () => {
	try {
	const { data } = await axios.get(API_URL); // procesa los datos recibidos, extrae información relevante como
  // identificación, nombre, peso, altura, temperamento, etc., y devuelve una serie de objetos formateados.
   
	return data.map((d) => {
		let [weightMin, weightMax] = d.weight.metric.split("-");
		let [heightMin, heightMax] = d.height.metric.split("-");
		let temperament = d.hasOwnProperty("temperament")
		? d.temperament.split(/\s*(?:,|$)\s*/)
		: [];
		const result = {
		id: d.id,
		name: d.name,
		weightMin: Number(weightMin),
		weightMax: Number(weightMax),
		heightMin: Number(heightMin),
		heightMax: Number(heightMax),
		temperament: temperament,
		lifeSpan: d.life_span,
		bredFor: d.bred_for,
		image: d.reference_image_id,
		source: "API",
		};
		return result;
	});
	} catch (error) {
	console.error("getApiData: ", error.message);
	throw error;
	}
  };

// Get Data from database
const getDbData = async () => { // recupera datos de perros de la base de datos utilizando Sequelize.
  // los datos recuperados tienen un formato similar a los datos de API.
  try {
    const dogs = await Dog.findAll({
      include: {
        model: Temperament,
        through: {
          attributes: [],
        },
      },
    });

    if (dogs.length) {
      // format record like API
      const dbData = dogs.map((d) => {
        const tempArray = d.temperaments.map((t) => t.name);
        const data = {
          id: d.id,
          name: d.name,
          weightMin: d.weightMin,
          weightMax: d.weightMax,
          heightMin: d.heightMin,
          heightMax: d.heightMax,
          temperament: tempArray,
          lifeSpan: d.lifeSpan,
          bredFor: d.bredFor,
          image: d.image.url,
          source: "DB",
        };
        return data;
      });
      return dbData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("getDbData: ", error.message);
    throw error;
  }
};

// Join all the data
const getAllData = async () => { //  combina datos obtenidos de la API y la base de datos.
  const api = await getApiData();
  const db = await getDbData();
  console.log(db);

  const all = [...api, ...db];
  // sort by default alphabetic ASC
  all.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

  return all;
};

// Recuperar datos por ID de raza:
const getByIdRaza = async (idRaza) => {
  try {
    const data = await getAllData(); // Llama getAllData para obtener todos los datos y luego busca al perro con la
    // identificación especificada.
    const dog = data.find((d) => d.id.toString() === idRaza.toString());
    return dog || false;
  } catch (error) { // Si se produce un error durante el proceso, se detecta, se registra y se vuelve a generar.
    console.error("getByIdRaza: ", error.message);
    throw error;
  }
};

// Agregar nueva raza:
const addNewBreed = async ({
  name,
  heightMin,
  heightMax,
  weightMin,
  weightMax,
  lifeSpan,
  image,
  bredFor,
  temperaments,
}) => {
  try {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    // Create a new breed
    const newDog = await Dog.create({
      name: capitalizedName,
      heightMin,
      heightMax,
      weightMin,
      weightMax,
      lifeSpan,
      bredFor,
      image,
      temperaments,
    });

    // Add temperaments to newDog
    if (temperaments && Array.isArray(temperaments)) {
      await Promise.all(
        temperaments.map(async (tempName) => {
          const [temp] = await Temperament.findOrCreate({
            attributes: ["id"],
            where: { name: tempName },
          });

          if (temp) {
            await newDog.addTemperament(temp);
          } else {
            console.error(`Temperament not found for name: ${tempName}`);
          }
        })
      );
    } else {
      console.error('Invalid temperaments provided');
    }

    return newDog;
  } catch (error) {
    console.error("addNewBreed: ", error.message);
    throw error;
  }
};


// Eliminar raza de la base de datos:
const deleteDbBreed = async (id) => {
  try {
    const res = await Dog.destroy({
      where: {
        id,
      },
      force: true,
    });
    return res;
  } catch (error) {
    console.error("deleteDbBreed: ", error.message);
    throw error;
  }
};

module.exports = {
  getApiData,
  getDbData,
  getAllData,
  getByIdRaza,
  addNewBreed,
  deleteDbBreed,
};
