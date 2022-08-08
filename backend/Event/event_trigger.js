const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);
var mqtt    = require('mqtt');



function check(){

MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            let devices_data=[];
            var ip = ''
            
            db.collection('devices').find({}, {projection: {_id: 0}}).toArray()
                .then((item, err) => {
                    if(err) throw err;
                    db.collection('event_configuration').find({}, {projection: {_id: 0}}).toArray((err1, result) => {
                            if(err1) console.log(err1);
                       
                            if(result.length > 0){
                                result.forEach((ele, index ) => {
                                 
                                    if(ele.status === 'Active'){
                                        if(ele.frequency === 'Once'){
                                            devices_data[index] = ele;
                                            let selectedDevice = item.find((items) => {
                                             return items.device_name == ele.device_name;
                                             })
                                        //  console.log(devices_data)
                                        //  console.log(selectedDevice)
                                        if(ele.event === 'LogOff'){
                                             ip = 'http://'+selectedDevice.device_ip+':9000/logoff';
                                        }  
                                        else if(ele.event === 'Shutdown') {
                                            ip = 'http://'+selectedDevice.device_ip+':9000/shutdown';
                                        }
                                        else if(ele.event === 'Status') {
                                            ip = 'http://'+selectedDevice.device_ip+':9000/status';
                                        }
                                        else if(ele.event === 'Subscribe') {

                                           mqtt_function(selectedDevice,ele.topic)
                                                    .then((ji) => {
                                                        console.log(ji)
                                                        var today = new Date();
                                                    today.setHours(today.getHours() + 5);
                                                    today.setMinutes(today.getMinutes() + 30);                                           
                                                        let query = {event_id : devices_data[index]['event_id'] };
                                                        console.log(query)
                                                        let updatedValues = { $set: { last_modified: today,
                                                                                        status: 'Inactive' 
                                                                                    }}
                                                        db.collection("event_configuration").updateOne( query, updatedValues, (err2, result1) => {
                                                            if(err2) console.log(err2);
                                                            if(result1.modifiedCount != 0){
                                                                console.log('Status updated');
                                                                var query1 = {event_id: devices_data[index].event_id,
                                                                    device_name: devices_data[index].device_name,
                                                                    event: devices_data[index].event,
                                                                    frequency: devices_data[index].frequency,
                                                                    last_modified: today,
                                                                    status: 'Inactive' ,
                                                                    device_model: selectedDevice.device_model,
                                                                    device_ip: selectedDevice.device_ip,
                                                                    data: {
                                                                        topic: ji.topic,
                                                                        value: ji.message.value,
                                                                        unit: ji.message.Unit,
                                                                        device_id: ji.message.deviceID,
                                                                        reported_time: ji.message.reportTime === "" ? today: ji.message.reportTime 
                                                                    }
                                                                }
                                                            db.collection("event_logs").insertOn( query1, (err3, result2) => {
                                                                if(err3) console.log(err3);
                                                                console.log('Event log added');
                                                            })
                                                            }
                                                        })
                                             })
                                         
                                            
                                          
                                            
                                        }
                                         if(ele.event !== 'Subscribe'){
                                             console.log(1)
                                        axios.get(ip)
                                            .then((res) => {
                                                console.log(res.data)
                                                if(res.data == 'Windows Success'){
                                                    console.log('Windows Success')
                                                    var today = new Date();
                                                    today.setHours(today.getHours() + 5);
                                                    today.setMinutes(today.getMinutes() + 30);                                           
                                                        let query = {event_id : devices_data[index]['event_id'] };
                                                        console.log(query)
                                                        let updatedValues = { $set: { last_modified: today,
                                                                                        status: 'Inactive' 
                                                                                    }}
                                                        db.collection("event_configuration").updateOne( query, updatedValues, (err2, result1) => {
                                                            if(err2) console.log(err2);
                                                            if(result1.modifiedCount != 0){
                                                                console.log('Status updated');
                                                                var query1 = {event_id: devices_data[index].event_id,
                                                                    device_name: devices_data[index].device_name,
                                                                    event: devices_data[index].event,
                                                                    frequency: devices_data[index].frequency,
                                                                    last_modified: today,
                                                                    status: 'Inactive' ,
                                                                    device_model: selectedDevice.device_model,
                                                                    device_ip: selectedDevice.device_ip,
                                                                    data: {}
                                                                }
                                                            db.collection("event_logs").insertOne( query1, (err3, result2) => {
                                                                if(err3) console.log(err3);
                                                                console.log('Event log added');
                                                            })
                                                            }
                                                        })
                                                      

                                                    }
                                                    else if(res.data.Available_drives != undefined){
                                                        console.log(res.data)
                                                        
                                                        var today = new Date();
                                                        today.setHours(today.getHours() + 5);
                                                        today.setMinutes(today.getMinutes() + 30);                                           
                                                            let query = {event_id : devices_data[index]['event_id'] };
                                                            console.log(query)
                                                            let updatedValues = { $set: { last_modified: today,
                                                                                            status: 'Inactive' 
                                                                                        }}
                                                            db.collection("event_configuration").updateOne( query, updatedValues, (err2, result1) => {
                                                                if(err2) console.log(err2);
                                                                if(result1.modifiedCount != 0){
                                                                    console.log('Status updated');
                                                                    var query1 = {event_id: devices_data[index].event_id,
                                                                        device_name: devices_data[index].device_name,
                                                                        event: devices_data[index].event,
                                                                        frequency: devices_data[index].frequency,
                                                                        last_modified: today,
                                                                        status: 'Inactive' ,
                                                                        device_model: selectedDevice.device_model,
                                                                        device_ip: selectedDevice.device_ip,
                                                                        data: {
                                                                            Available_drives: res.data.Available_drives,
                                                                            CPU_Utilization: res.data['CPU Utilization'],
                                                                            RAM_memory_Free: res.data['RAM memory Free'],
                                                                            RAM_memory_Total: res.data['RAM memory Total'],
                                                                            RAM_memory_Available: res.data['RAM memory Available'],
                                                                            Total_Hard_disk: res.data['Total Hard-disk'],
                                                                            Used_Hard_disk: res.data['Used Hard-disk'],
                                                                            Free_Hard_disk: res.data['Free Hard-disk'],
                                                                            CPU_Statistics_Interrupts: res.data['CPU Statistics Interrupts'],
                                                                            Internet_Status: res.data['Internet Status'],
                                                                        }
                                                                    }
                                                                db.collection("event_logs").insertOne( query1, (err3, result2) => {
                                                                    if(err3) console.log(err3);
                                                                    console.log('Event log added');
                                                                })
                                                                }
                                                            })
                                                          
                                                    }

                                                        })

                                                        
                                                        .catch((err) => console.log(1))
                                             }
                                        }

                                        else {
                                            console.log(ele.frequency)
                                            var targettime = new Date();
                                            targettime.setHours(targettime.getHours() + 5);
                                            targettime.setMinutes(targettime.getMinutes() + 30); 
                                            if(ele.frequency =='1m')
                                            {
                                                ele.last_modified.setMinutes(ele.last_modified.getMinutes() + 1);

                                            }
                                            else if(ele.frequency =='10s')
                                            {
                                                
                                                ele.last_modified.setSeconds(ele.last_modified.getSeconds() + 10);
                                             
                                            }
                                            

                                            else if(ele.frequency =='5m')
                                            {
                                                ele.last_modified.setMinutes(ele.last_modified.getMinutes() + 5);
                                            }
                                            else if(ele.frequency =='1h')
                                            {
                                                ele.last_modified.setMinutes(ele.last_modified.getMinutes() + 60);
                                            }
                                            else if(ele.frequency =='1d')
                                            {            
                                                ele.last_modified.setDate( ele.last_modified.getDate() + 1);
                                            }
                                                if(targettime > ele.last_modified){
                                                    devices_data[index] = ele;
                                                    let selectedDevice = item.find((items) => {
                                                     return items.device_name == ele.device_name;
                                                     })
                                                // console.log(selectedDevice)
                                                if(ele.event === 'LogOff'){
                                                     ip = 'http://'+selectedDevice.device_ip+':9000/logoff';
                                                }  
                                                else if(ele.event === 'Shutdown') {
                                                    ip = 'http://'+selectedDevice.device_ip+':9000/shutdown';
                                                }
                                                else if(ele.event === 'Status') {
                                                    ip = 'http://'+selectedDevice.device_ip+':9000/status';
                                                
                                                }
                                                else if(ele.event === 'Subscribe') {
                                                    
                                                    mqtt_function(selectedDevice,ele.topic)
                                                    .then((ji) => {
                                                        
                                                              
                                                        
                                                        let query = {event_id : devices_data[index]['event_id'] };
                                                      
                                                        let updatedValues = { $set: { last_modified:  ele.last_modified,
                                                                                        
                                                                                    }}
                                                        db.collection("event_configuration").updateOne( query, updatedValues, (err2, result1) => {
                                                            if(err2) console.log(err2);
                                                            if(result1.modifiedCount != 0){
                                                                console.log('Status updated');
                                                                var query1 = {event_id: devices_data[index].event_id,
                                                                    device_name: devices_data[index].device_name,
                                                                    event: devices_data[index].event,
                                                                    frequency: devices_data[index].frequency,
                                                                    last_modified:  ele.last_modified,
                                                                    status: 'Active' ,
                                                                    device_model: selectedDevice.device_model,
                                                                    device_ip: selectedDevice.device_ip,
                                                                    data: {
                                                                        topic: ji.topic,
                                                                        value: ji.message.value,
                                                                        unit: ji.message.Unit,
                                                                        device_id: ji.message.deviceID,
                                                                        reported_time: ji.message.reportTime === "" ?  ele.last_modified: ji.message.reportTime 
                                                                    }
                                                                }
                                                            db.collection("event_logs").insertOne( query1, (err3, result2) => {
                                                                if(err3) console.log(err3);
                                                                console.log('Event log added');
                                                            })
                                                            }
                                                        })
                                             })
                                         
                                            
                                          
                                                }
                                                if(ele.event !== 'Subscribe'){
                                                axios.get(ip)
                                                    .then((res) => {
                                                        if(res.data == 'Windows Success'){
                                                            console.log('Windows Success')
                                                            var today = new Date();
                                                            today.setHours(today.getHours() + 5);
                                                            today.setMinutes(today.getMinutes() + 30);                                           
                                                                let query = {event_id : devices_data[index]['event_id'] };
                                                                let updatedValues = { $set: { last_modified: today
                                                                }}
                                                                db.collection("event_configuration").updateOne( query, updatedValues, (err2, result1) => {
                                                                    if(err2) console.log(err2);
                                                                    if(result1.modifiedCount != 0){
                                                                        console.log('Status updated');
                                                                        var query1 = {event_id: devices_data[index].event_id,
                                                                            device_name: devices_data[index].device_name,
                                                                            event: devices_data[index].event,
                                                                            frequency: devices_data[index].frequency,
                                                                            last_modified: today,
                                                                            status: 'Active' ,
                                                                            device_model: selectedDevice.device_model,
                                                                            device_ip: selectedDevice.device_ip,
                                                                            data: {}
                                                                        }
                                                                    db.collection("event_logs").insertOne( query1, (err3, result2) => {
                                                                        if(err3) console.log(err3);
                                                                        console.log('Event log added');
                                                                    })
                                                                    }
                                                                })
                                                              
        
                                                            }
                                                            else if(res.data.Available_drives != undefined){
                                                               
                                                                
                                                                var today = new Date();
                                                                today.setHours(today.getHours() + 5);
                                                                today.setMinutes(today.getMinutes() + 30);                                           
                                                                    let query = {event_id : devices_data[index]['event_id'] };
                                                                   
                                                                    let updatedValues = { $set: { last_modified: today
                                                                                                    
                                                                                                }}
                                                                    db.collection("event_configuration").updateOne( query, updatedValues, (err2, result1) => {
                                                                        if(err2) console.log(err2);
                                                                        if(result1.modifiedCount != 0){
                                                                            console.log('Status updated');
                                                                            var query1 = {event_id: devices_data[index].event_id,
                                                                                device_name: devices_data[index].device_name,
                                                                                event: devices_data[index].event,
                                                                                frequency: devices_data[index].frequency,
                                                                                last_modified: today,
                                                                                status: 'Active' ,
                                                                                device_model: selectedDevice.device_model,
                                                                                device_ip: selectedDevice.device_ip,
                                                                                data: {
                                                                                    Available_drives: res.data.Available_drives,
                                                                                    CPU_Utilization: res.data['CPU Utilization'],
                                                                                    RAM_memory_Free: res.data['RAM memory Free'],
                                                                                    RAM_memory_Total: res.data['RAM memory Total'],
                                                                                    RAM_memory_Available: res.data['RAM memory Available'],
                                                                                    Total_Hard_disk: res.data['Total Hard-disk'],
                                                                                    Used_Hard_disk: res.data['Used Hard-disk'],
                                                                                    Free_Hard_disk: res.data['Free Hard-disk'],
                                                                                    CPU_Statistics_Interrupts: res.data['CPU Statistics Interrupts'],
                                                                                    Internet_Status: res.data['Internet Status'],
                                                                                }
                                                                            }
                                                                        db.collection("event_logs").insertOne( query1, (err3, result2) => {
                                                                            if(err3) console.log(err3);
                                                                            console.log('Event log added');
                                                                        })
                                                                        }
                                                                    })
                                                                  
                                                            }
        
                                                                })
                                                                .catch((err) => console.log(1))
                                                            }
                                                }
                                            

                                        }
                                        
                                    }
                                   
                                })
                                // return res.status(200).send(result)
                            }
                            else{
                                // return res.status(208).send("No Data")
                            }
                        })
                })
                .catch(err => console.log(err))
           
         })
        }

check()
setInterval(() => {
    check()
}, 10000);

async function mqtt_function(selectedDevice, topicName){
    
    var client  = mqtt.connect(selectedDevice.host,
    {
        port: 1883,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        username: selectedDevice.username,
        password:  selectedDevice.password,
        keepalive: 1,
        reconnectPeriod: 0,
    }
    );
    var topic='',message
    console.log(topicName)
    await client.on("connect",function(hu,err){
        if(err) console.log(err)	
        console.log("connected");
      
        client.subscribe(topicName)
             
     
    })
    
    

    let k= new Promise((resolve, reject)=>{ 
        
        client.on('message', (topic, payload) => {
        

        console.log('Received Message:', topic, payload.toString())
    
            
        
         topic = topic
         message = JSON.parse(payload.toString())
        
         client.end();
        resolve({topic,message})
    
      })
    }
    )
    
      let d1 = await k
 
        
      return d1;
    

}