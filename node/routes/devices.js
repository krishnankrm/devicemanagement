const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);


router.post('/add', async (req, res) => {
    console.log(req.body)
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);

    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData= [];

            req.body.device_name.forEach((element,index) => {
                queryData.push(
                    {
                        device_model: req.body.device_model,
                        device_name: req.body.device_name[index],
                        device_ip: req.body.device_ip[index],
                        lan_mac_address: req.body.device_mac_address[index],
                        location: req.body.location[index],
                        created_time: today
                      }
                )
            });
            console.log(queryData)

            db.collection('devices').insertMany(queryData, (err, result) => {
                if(err) console.log( err );
                if(result.acknowledged) {
                    return res.status(200).send('Devices added successfully');
                }
            })
        })
})

router.post('/showlog', async (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            db.collection('devices').find({}).toArray((err, result)=>{
                if(err) console.log( err );
                res.send(result)
            })
        })
})



module.exports = router;