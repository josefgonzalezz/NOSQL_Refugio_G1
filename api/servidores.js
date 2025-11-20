//Crea el server principal

//npm install express mongoose body-parser cors
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');//URL y https

//const rutas

const app = express();
const PORT = 3000;

//Middlewares (Son como las urls del sitio) 
app.use(cors());
app.use(bodyParser.json());

//las rutas


//Inciar el servidor, o como veremos el server.
app.listen(PORT, ()=>{
    console.log(`Servidor encendido https://localhost:${PORT}`);
});




// function hola (){

// }

// ()=>