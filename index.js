const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');
require('dotenv').config;

const port = process.env.PORT || 5000;


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());



const uri = "mongodb+srv://AMFHospital:AMFahim1234@cluster0.cwf82.mongodb.net/doctorsPortal1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




app.get('/', (req, res) => {
  res.send("Hello World")
})


client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal1").collection("appointment");

  
  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    // console.log(appointment)
    appointmentCollection.insertOne(appointment)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

 app.post('/appointmentByDate', (req, res) => {
   const date = req.body
   appointmentCollection.find({date: date.date})
   .toArray((err, documents) => {
     res.send(documents)
   })
 })

 app.get('/appointments', (req, res) => {
   appointmentCollection.find()
   .toArray((err, appointments) => {
     res.send(appointments)
   })
 })

 app.post('/addADoctor', (req, res) => {
   const file = req.files.file;
   const name = req.body.name;
   const email = req.body.email;
   console.log(name, email, file);
   file.mv(`${__dirname}/doctors/${file.name}`, err => {
     if(err){
       console.log(err)
       return res.status(500).send({msg: 'Failed to upload Image'});
     }
     return res.send({name: file.name, path: `/${file.name}`})
   }
   )
 })



});



app.listen(port);