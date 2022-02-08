const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);
const axios = require('axios');
var ping = require('ping');


router.post('/connect', async(req, res) => {

    if(req.body)
    let k=req.body.device_ip
    let res1 = await ping.promise.probe(k, {
           timeout: 10,
           extra: ['-i', '2'],
       });

    
    if(res1.alive === true){
        var today = new Date();
        today.setHours(today.getHours() + 5);
        today.setMinutes(today.getMinutes() + 30);
    
        console.log(req.body)
        MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var existingQuery = {device_name: req.body.device_name};
            var newData = { $set: {
                device_protocol: req.body.device_protocol, 
                status:'Configured',
                modified_time: today
                }
            };
            db.collection('devices').updateOne(existingQuery, newData, (err, result) => {
                console.log(result)
                    if(result.modifiedCount != 0){
                        return res.status(200).send('Device Configured');
                    }
                })
            })

            .catch((err) => console.log(err))
    }

})


module.exports = router;