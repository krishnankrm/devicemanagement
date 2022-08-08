const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);
const axios = require('axios');
var ping = require('ping');
const net = require('net');
var mqtt    = require('mqtt');

router.post('/connect', async(req, res) => {
    console.log(req.body)
    if(req.body.device_protocol === "HTTP"){
            let res1 = await ping.promise.probe(req.body.device_ip, {
                timeout: 10,
                // extra: ['-i', '2'],
            });
                console.log(res1.alive)
            if(res1.alive === true){
                var today = new Date();
                today.setHours(today.getHours() + 5);
                today.setMinutes(today.getMinutes() + 30);
            
                
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
                            if(result.modifiedCount != 0){
                                return res.status(200).send('Device Configured');
                            }
                        })
                    })

                    .catch((err) => console.log(err))
            }
            else{
                return res.status(208).send('Connection failed')
            }
    }
    else if(req.body.device_protocol === "Modbus-TCP"){

        var client = net.connect({port: req.body.port, host:req.body.device_ip},function(){    
            console.log('connected')
            var today = new Date();
            today.setHours(today.getHours() + 5);
            today.setMinutes(today.getMinutes() + 30);
        
            
            MongoClient.connect()
            .then(() => {
                const db = MongoClient.db("device_mgt");
                var existingQuery = {device_name: req.body.device_name};
                var newData = { $set: {
                    device_protocol: req.body.device_protocol, 
                    status:'Configured',
                    modified_time: today,
                    port: req.body.port
                    }
                };
                db.collection('devices').updateOne(existingQuery, newData, (err, result) => {
                        if(result.modifiedCount != 0){
                            return res.status(200).send('Device Configured');
                        }
                    })
                })
           

        });
          
        client.on('error', function(err){
            return res.status(208).send('Connection failed')
        })
        
    }
    else if(req.body.device_protocol === "MQTT"){
        
        MongoClient.connect()
            .then(() => {
                const db = MongoClient.db("device_mgt");
            
                // var client  = mqtt.connect("mqtt://"+req.body.mqtt, {port:1883, clientId: req.body.mqttclientid, username: req.body.mqttusername, password: req.body.mqttpassword});
                var options = {
                    port: 1883,
                    host: 'mqtt://'+req.body.device_ip,
                    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
                    username: req.body.mqttusername,
                    password:  req.body.mqttpassword,
                    keepalive: 60,
                    reconnectPeriod: 1000,
                  };
                
                var client  = mqtt.connect('mqtt://'+req.body.device_ip,options)
                console.log(req.body.device_ip)
                var today = new Date();
                today.setHours(today.getHours() + 5);
                today.setMinutes(today.getMinutes() + 30);
        
                var existingQuery = {device_name: req.body.device_name};
                var newData = { $set: {
                    device_protocol: req.body.device_protocol, 
                    status:'Configured',
                    modified_time: today,
                    host: options.host,
                    clientId: options.clientId,
                    username:  options.username,
                    password: options.password
                    }
                };console.log(newData)
        
                client.on("connect",function(){
                    console.log(1)
                    db.collection('devices').updateOne(existingQuery, newData, (err, result) => {
                        if(result.modifiedCount != 0){
                            client.end();
                            return res.status(200).send('Device Configured');
                        }
                    })                   
                });

                client.on("error",function(){
                    
                    client.end();
                    return res.status(208).send('error');
                })

            });

    }

})


module.exports = router;