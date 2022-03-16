const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // Crea un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // salva el proyecto en DB
        await proyecto.save();

        return res.status(201).json({proyecto});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error" });
    }
} 

// obtener todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        return res.json(proyectos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hubo un error' });
    }
}

// actualiza un proyecto
exports.actualizaProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: "Proyecto no encontrado"});
        }

        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        return res.json({proyecto});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hubo un error' });
    }
}

// eliminar un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
    try {

        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        return res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hubo un error' });
    }
}