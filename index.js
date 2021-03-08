require('dotenv').config();

const express = require('express');

const cors = require('cors');
const { dbConnection } = require('./database/config');


// Crear el servidor de express
const app = express();


const bodyParser = require('body-parser')
    // Configurar CORS Es un Middleware una función que ejecuta todas las lineas hacia abajo.
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Directorio público
app.use(express.static('public'));

app.use(bodyParser.json());

//RUTAS
//Rutas (Cuando pase por aqui(api/usuarios) el middleware hace que requiera las rutas de usuarios)
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/valvulas', require('./routes/valvulas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));


// Pone el puerto especificado en el proceso creado en el archivo .env (archivo variables de entorno)
app.listen(process.env.PORT, () => {
    console.log('Servidor corriento en puerto ' + process.env.PORT);
});