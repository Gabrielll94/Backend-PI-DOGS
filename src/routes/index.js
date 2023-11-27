const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const temperaments = require('./temperments')
const dogs = require('./dogs')
const breeds = require('./breeds');
// Crear un nuevo enrutador:
const router = Router(); // clase de Express que nos permite crear routers modulares que podemos montar en nuestra
// aplicación.

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/dogs', dogs)
router.use('/temperaments', temperaments)
router.use('/breeds', breeds);

module.exports = router;
