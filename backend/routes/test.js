// const url = require('../config/config.json').url;
// const mongo = require('mongodb').MongoClient;
// const MongoClient = new mongo(url);

// MongoClient.connect()
//         .then(async() => {
//             const db = MongoClient.db("device_mgt");
//             var query = {
//                 event_id: 24
//             }
//             db.collection('event_logs').deleteMany(query , (res, err)=> {
//                 if(err) console.log(err)
//                 console.log(res)
//             })
//         })


        var mqtt    = require('mqtt');
       var client  = mqtt.connect("mqtt://13.126.193.19",
        // var client  = mqtt.connect("mqtt://test.mosquitto.org",
        {
         
            username: 'isliot',
            password:  'Isl@iot',
            keepalive: 1,
            reconnectPeriod: 0,
            
        }
        );
        client.on("connect",function(hu,err){
            if(err) console.log(err)    
            console.log("connected");
           
            // {"lab_gas_sensor_NO2", "lab_gas_sensor_CH4", "lab_gas_sensor_C2H5O5", "lab_gas_sensor_H2", "lab_gas_sensor_NH3", "lab_gas_sensor_CO"}
                client.subscribe('RFId')  
             
              
               
        })
        
        
        client.on('message', (topic, payload) => {
            console.log('Received Message:', topic, payload.toString())
            // client.end();
          })
        
          
        // client.on('connect', function () {
        //   var  count=0
          
        //      client.publish('Isl_relay_motor',count.toString())
         
          
        //  })
