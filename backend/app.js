const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const mongo = require('mongodb').MongoClient;


var url = require('./config/config.json').url;
const MongoClient = new mongo(url);

var app = express();

app.use(cors())
// parse application/json
app.use(bodyParser.json())

//All pages routers url declarations
app.use('/login', require('./routes/login'));
app.use('/users', require('./routes/users_mgt'));
app.use('/devices', require('./routes/devices'));
app.use('/configuration', require('./routes/configuration'));
app.use('/event', require('./routes/events'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/mqtt',require('./mqtt_Arduino/mqtt'));
app.use('/lab',require('./routes/lab'));
app.use('/alert',require('./routes/alert'));

async function main() {
    await MongoClient.connect();
        const db = MongoClient.db("device_mgt");
        db.listCollections({name: 'login'})
            .next((err, items) => {
                if(err) throw err;
                if(items == null){
                    db.createCollection("login", (err,db) => {
                        if(err) throw err;
                        console.log("Collection created");
                    })
                    db.createCollection("face_count", (err,db) => {
                        if(err) throw err;

                    })
                    

                    var myobj = {username: "admin", password: "admin", email: "admin@gmail.com", role: "Admin"};
                    db.collection("login").insertOne(myobj, (err, res) => {
                        if(err) throw err;
                        console.log("1 document inserted");
                        MongoClient.close();
                    })   

                    var myobj1 = {face_id: 1};
                    db.collection("face_count").insertOne(myobj1, (err, res) => {
                        if(err) throw err;
                        console.log("1 document inserted");
                        MongoClient.close();
                    }) 
                }
            })
}

main()
    .then(() => {
        var server = app.listen(8081, ()=> {
            console.log('Server started on PORT',  server.address().port);
        })
    })
    .catch(console.error)
  
