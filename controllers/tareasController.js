const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        
        if(!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        return res.status(201).json({tarea});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error" });
    }
}

// obtener las tareas
exports.obtenerTareas = async (req, res) => {

    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No Autorizado" });
        }

        //obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creada: -1 });
        return res.status(200).json({ tareas });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error" });
    }
}

// actualizar una tarea por su id
exports.actualizarTarea = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: "Tarea no existe" });
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // crea una nueva tarea
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // guarda la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        return res.status(200).json({ tarea });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error" });
    }
}

// elimina una tarea por su id
exports.eliminarTarea = async (req, res) => {
    try {
        // extraer el proyecto y comprobar si existe
        const { proyecto} = req.query;

        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: "Tarea no existe" });
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // elimina la tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        return res.status(200).json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error" });
    }
}