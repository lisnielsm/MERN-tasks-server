// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { check } = require('express-validator');

// Crea un usuario
// api/usuarios
router.post('/',
    [
        check( 'nombre', 'El nombre es obligatorio').notEmpty(),
        check( 'email', 'Agrega un email válido').isEmail(),
        check( 'password', 'El password debe ser minímo de 6 caracteres').isLength({ min: 6 })
    ], 
    usuariosController.crearUsuario);

module.exports = router;