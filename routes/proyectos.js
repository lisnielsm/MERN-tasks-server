const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectosController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// crea proyectos
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],  
    proyectoController.crearProyecto
);

// obtiene todos los proyectos
// api/proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)

// actualiza un proyecto
// api/proyectos/:id
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],
    proyectoController.actualizaProyecto
)

// elimina un proyecto
// api/proyectos/:id
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)


module.exports = router;