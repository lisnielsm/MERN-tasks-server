const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// crea una nueva tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('proyecto', 'El proyecto es obligatorio').notEmpty()
    ],
    tareasController.crearTarea
);

// obtener las tareas
// api/tareas
router.get('/',
    auth,   
    tareasController.obtenerTareas
)

// actualizar una tarea
// api/tareas/:id
router.put('/:id',
    auth, 
    tareasController.actualizarTarea
);

// elimina una tarea
// api/tareas/:id
router.delete('/:id',
    auth,
    tareasController.eliminarTarea
);

module.exports = router;