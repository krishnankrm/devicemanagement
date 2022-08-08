const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);

router.post('/add', async (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData = {
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              role: req.body.role,
            };


            db.collection('login').insertOne(queryData, (err, result) => {
                if(err) console.log( err );
                if(result.acknowledged) {
                    return res.status(200).send('User added successfully');
                }
            })
        })
})

router.get('/fetch', async (req,res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            
            db.collection('login').find({}, {projection: { _id: 0 }}).toArray()
                .then( (result) => {

                    if(result.length>0) return res.status(200).send(result);
                    else return res.status(206).send('No data available');
                    
                })
                .catch(err => console.log(err))
        })
})


module.exports = router;