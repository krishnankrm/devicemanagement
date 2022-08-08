const mqtt = require('mqtt')

const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);


router.post('/led_control',  (req, res) => {
    console.log('led_control')
        // const client  = mqtt.connect("mqtt://13.126.193.19",
        var client  = mqtt.connect("mqtt://broker.mqtt-dashboard.com");
        //{
            // port: 1883,
            // host: 'mqtt://13.126.193.19',
            // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
            // username: 'isliot',
            // password:  'Isl@iot',
            // keepalive: 60,
            // reconnectPeriod: 1000,
        //});
        client.on('connect', function () {
            
          
            var message= ''
            req.body.message === true ? message = '0' : message = '1';
            console.log(message)
            var topic="Isl_lab_light_check_555";
            client.publish(topic,message);
            return res.status(200).send('Message published');
    })
   
    client.on('error', function(){
        console.log("ERROR")
        client.end();
        return res.status(200).send('Error');
    })
        
        
        
})



module.exports = router;