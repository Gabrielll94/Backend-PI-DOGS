const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const temperaments = require('./temperments')
const dogs = require('./dogs')
const breeds = require('./breeds');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/dogs', dogs)
router.use('/temperaments', temperaments)
router.use('/breeds', breeds);

module.exports = router;
