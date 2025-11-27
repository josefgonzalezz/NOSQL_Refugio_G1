//Crea el server principal

//npm install express mongoose body-parser cors
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');//URL y https

//const rutas
const adopcionRoutes = require('./routes/AdopcionRoutes');
const animalRoutes = require('./routes/AnimalRoutes');
const donacionRoutes = require('./routes/DonacionRoutes');
const eventoRoutes = require('./routes/EventoRoutes');
const formularioRoutes = require('./routes/FormularioRoutes');
const medicamentoRoutes = require('./routes/MedicamentoRoutes');
const personalRoutes = require('./routes/PersonalRoutes');
const refugioRoutes = require('./routes/RefugioRoutes');
const usuarioRoutes = require('./routes/UsuarioRoutes');
const visitaRoutes = require('./routes/VisitaRoutes');
const direccionRefugioRoutes = require('./routes/DireccionRefugioRoutes');
const tipoAnimalRoutes = require('./routes/TipoAnimalRoutes');

const app = express();
const PORT = 3000;

//Middlewares (Son como las urls del sitio) 
app.use(cors());
app.use(bodyParser.json());

//Conexion a mongodb
mongoose.connect('mongodb://localhost:27017/AnimalShelter')
  .then(() => console.log('Mongo DB Conectado correctamente'))
  .catch(err => console.log('Error al conectar Mongo DB: ', err));

//las rutas

app.use('/api/adopcion', adopcionRoutes);
app.use('/api/animal', animalRoutes);
app.use('/api/donacion', donacionRoutes);
app.use('/api/evento', eventoRoutes);
app.use('/api/formulario', formularioRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/refugios', refugioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/direccionesRefugio', direccionRefugioRoutes);
app.use('/api/tiposAnimales', tipoAnimalRoutes);



//Inciar el servidor, o como veremos el server.
app.listen(PORT, ()=>{
    console.log(`Servidor encendido http://localhost:${PORT}`);
});




// function hola (){

// }

// ()=>