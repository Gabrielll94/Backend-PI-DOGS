  const express = require('express');
  const breeds = express.Router();
  const { getAllData } = require('../controllers/dogs');

  // Maneja la obtención y búsqueda de información sobre razas de perros, así como la generación de una lista de grupos
// de razas únicas.

//Medio software:
  breeds.use(express.json());
  // Manejo de la ruta principal ( /):
  breeds.get('/', async (req, res) => {
      const {breedGroup} = req.query;
      //Se obtiene la información de todas las razas de perros mediante la función getAllData.
      const everyDog = await getAllData(); 
    if (breedGroup) {
        try {   
        
        if (!Array.isArray(everyDog)) {
      throw new Error('Unexpected data structure from getAllData');
        }
      
        const dogSearchResult = breedGroup === 'all' ? everyDog : everyDog.filter((dog) => {
      return dog.bredFor && dog.bredFor.toLowerCase().includes(breedGroup.toLowerCase());
        });
      
        res.status(200).json(dogSearchResult);
      } catch (error) {
        console.error('Error on breedGroup route:', error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else { // Manejo del caso cuando breedGroup no está presente:
        try {
            //    const everyDog = await getAllData();
              if (!Array.isArray(everyDog)) {
                  throw new Error('Unexpected data structure from getAllData');
              }
              
                const everyBreedGroup = everyDog.map((dog) => {
                    return dog.bredFor || "No info";
                });
                console.log(everyBreedGroup);
                // Se filtran los grupos únicos y se devuelven ordenados en formato JSON.
                const uniqueBreedGroups = Array.from(new Set(everyBreedGroup));
    
                return res.status(200).json(uniqueBreedGroups.sort());
          } catch (error) {
              console.error('Error on breeds route:', error.message);
              return res.status(500).json({ error: "Internal Server Error" });
          }
      }});


    


  module.exports = breeds;
