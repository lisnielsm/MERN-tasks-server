const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const usuarios = require('./routes/usuarios');
const auth = require('./routes/auth');
const proyectos = require('./routes/proyectos');
const tareas = require('./routes/tareas');

// crear el servidor
const app = express();

// conectar a la base de datos
conectarDB();

// habilitar cors
app.use(cors());

// habiliatar el express.json
app.use(express.json( { extended: true }));

// importar rutas
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/proyectos', proyectos);
app.use('/api/tareas', tareas);

// puerto de la app
const port = process.env.port || 4000;

// arrancar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});  