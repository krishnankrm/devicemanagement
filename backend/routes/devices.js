const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);
const CsvParser = require("json2csv").Parser;

router.post('/add', async (req, res32) => {
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);

    await MongoClient.connect()
        .then(async() => {
            const db = MongoClient.db("device_mgt");
            var queryData= [];

            new Promise((resolve, reject) => {  

                req.body.device_name.forEach((element,index) => {

                     db.collection('devices').findOne({device_name: req.body.device_name[index]}, (err, result) => {
                         console.log(result)
                         if(result == null){
                             queryData.push(
                                     {
                                         device_model: req.body.device_model,
                                         device_name: req.body.device_name[index],
                                         device_ip: req.body.device_ip[index],
                                         lan_mac_address: req.body.device_mac_address[index],
                                         location: req.body.location[index],
                                         status:'Not configured',
                                         created_time: today,
                                       }
                                 )
                            if(index==req.body.device_name.length-1)
                            resolve(2)
                         }
                         else{
                              queryData=[]
                              reject('Device name repeated')
                         }
                     })
                     
                 });

            }).then(() => {
                db.collection('devices').insertMany(queryData, (err, result) => {
                    if(err) console.log( err );
                    if(result.acknowledged) {
                        return res32.status(200).send('Devices added successfully');
                    }
                })
            })
            .catch((err) =>  res32.status(208).send(err) )

    
               
        })
})

router.post('/showlog', async (req, res) => {
   

    var query={}, dateQuery={}
    if(req.body.location === undefined || req.body.location === '') {}
    // else query.location = { $in: [ /Ch/i ] } 
    else query.location = req.body.location
    
    if((req.body.device_model===undefined || req.body.device_model==='')) {}
    else query.device_model = req.body.device_model

    if((req.body.start===undefined || req.body.start==='')) {}
    else {
        var dateTime =  new Date(req.body.start);
        dateTime.setHours(dateTime.getHours() + 5);
        dateTime.setMinutes(dateTime.getMinutes() + 30);
        dateQuery.$gte = dateTime;
    }

    if((req.body.end===undefined || req.body.end==='')) {}
    else {
        var dateTime =  new Date(req.body.end);
        dateTime.setHours(dateTime.getHours() + 5);
        dateTime.setMinutes(dateTime.getMinutes() + 31);
        dateQuery.$lte = dateTime;
    }

    if((req.body.start===undefined || req.body.start==='') && (req.body.end===undefined || req.body.end==='')) {}
    else {
        query.created_time=dateQuery;
    }

    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            db.collection('devices').find(query).toArray((err, result)=>{
                if(err) console.log( err );
                let modifiedresult= result.map((ele, index)=>{
                    ele.created_time=ele.created_time.toISOString().slice(0,16)
                    if(ele.modified_time!==undefined) ele.modified_time=ele.modified_time.toISOString().slice(0,16)
                    return(ele)
                })
                res.send(modifiedresult)
            })
        })
})

router.delete('/deletelog', async (req, res) => {
    console.log('deletelog');
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");
        var query = { device_name : req.body.device_name }
        db.collection('devices').deleteOne( query, (err, result) => {
            if(err) console.log(err);
                if(result.deletedCount != 0){
                    db.collection('event_configuration').deleteMany( query, (err1, result1) => {
                        console.log(result1.deletedCount)
                        if(err1) console.log(err1);
                      
                            db.collection('event_logs').deleteMany( query, (err2, result2) => {
                                if(err1) console.log(err1);
                             
                                    return res.status(200).send('Log deleted successfully');
                                
                            })
                        
                    })
                    
                }
                else{
                    return res.status(208).send('Some error');
                }
        })
    });
})


router.post('/download_report', async (req, res) => {
    console.log('report')
    var query={}, dateQuery={}
    if(req.body.location === undefined || req.body.location === '') {}
    // else query.location = { $in: [ /Ch/i ] } 
    else query.location = req.body.location
    
    if((req.body.device_model===undefined || req.body.device_model==='')) {}
    else query.device_model = req.body.device_model

    if((req.body.start===undefined || req.body.start==='')) {}
    else {
        var dateTime =  new Date(req.body.start);
        dateTime.setHours(dateTime.getHours() + 5);
        dateTime.setMinutes(dateTime.getMinutes() + 30);
        dateQuery.$gte = dateTime;
    }

    if((req.body.end===undefined || req.body.end==='')) {}
    else {
        var dateTime =  new Date(req.body.end);
        dateTime.setHours(dateTime.getHours() + 5);
        dateTime.setMinutes(dateTime.getMinutes() + 31);
        dateQuery.$lte = dateTime;
    }

    if((req.body.start===undefined || req.body.start==='') && (req.body.end===undefined || req.body.end==='')) {}
    else {
        query.created_time=dateQuery;
    }
 
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            db.collection('devices').find(query , { projection: { _id: 0}}).toArray((err, result)=>{
                if(err) console.log( err );
                console.log(result)
                let modifiedresult= result.map((ele, index)=>{
                  
                    ele.created_time = ele.created_time.toISOString().slice(0,16)
                    if(ele.modified_time !== undefined) ele.modified_time=ele.modified_time.toISOString().slice(0,16)
                    if(ele.device_protocol == undefined) ele.device_protocol = 'NA';
                    if(ele.modified_time == undefined) ele.modified_time = 'NA';
                    return(ele)
                })
                
                const csvFields = ["TYPE", "NAME", "IP", "MAC ADDRESS", "LOCATION", "CREATED TIME"];
                const csvParser = new CsvParser({ csvFields });
                const csvData = csvParser.parse(modifiedresult);
                console.log(csvData)
                res.setHeader("Content-Type", "text/csv");
                res.setHeader("Content-Disposition", "attachment; filename=Device-log-report.csv");
                res.status(200).send(csvData);
            })
        })
})

module.exports = router;