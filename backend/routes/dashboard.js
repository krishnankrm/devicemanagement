const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);

router.get('/check_active', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            
            db.collection('event_configuration').count({status: 'Active'})
                .then( (activeCount) => {
                    db.collection('event_configuration').count({status: 'Inactive'})
                        .then((inactiveCount) => {
                         
                             let json_format = {
                                active: activeCount,
                                inactiveCount: inactiveCount
                            }
                   
                         return res.status(200).send(json_format);
                        })
                    
                })
                .catch(err => console.log(err))
        })
})

router.get('/check_configure', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            
            db.collection('devices').count({status: 'Configured'})
                .then( (configuredCount) => {
                    db.collection('devices').count({status: 'Not configured'})
                        .then((notconfiguredCount) => {
                             let json_format = {
                                configuredCount: configuredCount,
                                notconfiguredCount: notconfiguredCount
                            }
                            
                         return res.status(200).send(json_format);
                        })
                    
                })
                .catch(err => console.log(err))
        })
})


router.get('/check_devicetype', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
        
            db.collection('devices').distinct('device_model')
                .then((result) => {
                    let json_format = {}
                    result.forEach((element, index) => {
                        db.collection('devices').count({device_model: element})
                            .then((result1) => {
                            json_format[element] = result1;
                            })
                            .then(() => {
                                if(Object.keys(json_format).length == result.length){
                                    return res.status(200).send(json_format);
                                }
                            })
                        
                    })
                })
            })
});


router.post('/get_windows_data', (req, res) => {
    MongoClient.connect()
    .then( () => {
        const db = MongoClient.db("device_mgt");

        var  dateQuery={}

        if((req.body.start===undefined || req.body.start==='')) {
             db.collection('event_logs').find({event_id : req.body.event_id }).sort({ $natural: 1}).limit(1).next()
                 .then((temp_res, err) => {
                     if(err) console.log(err);
                     console.log(temp_res)
                     if(temp_res != null){
                     var dateTime =  new Date(temp_res.last_modified);
                     // dateTime.setHours(dateTime.getHours() + 5);
                     // dateTime.setMinutes(dateTime.getMinutes() + 30);
                     dateQuery.$gte = dateTime;
                     }
                     else{
                         return res.status(208).send('No data available for the Event Id: '+req.body.event_id);
                     }
                 })
                 
         }
         else {
             var dateTime =  new Date(req.body.start);
             dateTime.setHours(dateTime.getHours() + 5);
             dateTime.setMinutes(dateTime.getMinutes() + 30);
             dateQuery.$gte = dateTime;
         }
     
         if(req.body.end===undefined || req.body.end==='') {
            var dateTime =  new Date();
            dateTime.setHours(dateTime.getHours() + 5);
            dateTime.setMinutes(dateTime.getMinutes() + 31);
            dateQuery.$lte = dateTime;
         }
         else {
             var dateTime =  new Date(req.body.end);
             dateTime.setHours(dateTime.getHours() + 5);
             dateTime.setMinutes(dateTime.getMinutes() + 31);
             dateQuery.$lte = dateTime;
         }

        var query = {event_id: req.body.event_id, event: req.body.event , device_model: 'Windows-10', last_modified: dateQuery};
        console.log(query)
        db.collection('event_logs').find(query, {projection: { _id: 0 }}).toArray()
        .then (( result, err) => {
            if(err) console.log(err)
            
            if(result.length != 0){
                console.log('result',result.length)
                if(result.length < 30){
                    var ram_val = [], hd_val=[], internet_val=[], date_array=[];
              console.log(result[0].last_modified)
                    result.forEach((ele,index)=>{
                        console.log(ele)
                        date_array[index] = ele.last_modified
                      
                        hd_val[index]=ele.data.CPU_Utilization
                        ram_val[index] = ele.data.RAM_memory_Available
                        internet_val[index] = ele.data.Internet_Status
                       
                    })
                
                    json_format = {
                            CPU_Utilization : hd_val,
                            ram_val:ram_val,
                            internet_val: internet_val,
                            date_array : date_array
                    }
                    return res.status(200).send(json_format)
                }
                else{
                   
                    var ram_val = [], hd_val=[], internet_val=[];
                    var json_format = {},date_array = []
                    if(req.body.end===undefined || req.body.end===''){
                        var dateTime =  new Date();
                        dateTime.setHours(dateTime.getHours() + 5);
                        dateTime.setMinutes(dateTime.getMinutes() + 30);
 
                    }
                    else
                    {
                    var dateTime =  new Date(req.body.end);
                    dateTime.setHours(dateTime.getHours() + 5);
                        dateTime.setMinutes(dateTime.getMinutes() + 30);
 
                    }
                    if(req.body.start === undefined || req.body.start === ''){
                        var dateTime1 = new Date( query.last_modified.$gte)
                        dateTime1.setHours(dateTime1.getHours() - 5);
                        dateTime1.setMinutes(dateTime1.getMinutes() - 30);
 
                    }
                    else
                    {
                    var dateTime1 =  new Date(req.body.start);
                    dateTime1.setHours(dateTime1.getHours() + 5);
                    dateTime1.setMinutes(dateTime1.getMinutes() + 30);
 
                    }
                    
                    
                    const diffTime = Math.abs(dateTime - dateTime1)/1000;
                    const phasetime =diffTime/30
                    let start=dateTime1
                    let stop = new Date(dateTime1);
                    var d=[]
                    stop.setSeconds( start.getSeconds() + (phasetime))
                    // console.log('stop',stop)
                    for(var i=0 ; i<30;i++){
                      
                        let a 
                        a = start.setSeconds( start.getSeconds() + (phasetime))

                        stop.setSeconds( stop.getSeconds() + (phasetime))
                        result.forEach((ele,index)=>{
                            var newDate =  new Date(a);
                            newDate.setHours(newDate.getHours() + 5);
                            newDate.setMinutes(newDate.getMinutes() + 30);
                            date_array[i] = newDate;
                        
                           if(ele.last_modified >= start && ele.last_modified < stop)
                           {   
                            
                            // d.push(1)
                            hd_val[i]=ele.data.CPU_Utilization
                            ram_val[i] = ele.data.RAM_memory_Available
                            internet_val[i] = ele.data.Internet_Status
                           }
                        //    else
                        //     {
                             
                        //         hd_val[i]= null;
                        //         ram_val[i] = null
                        //         internet_val[i] = null
                                 
                        //    }
                        })
                    }
                    
                    
                    for(let j1=0;j1<30;j1++)
                    {
                        if(hd_val[j1] == null){
                            hd_val[j1] = null;
                            ram_val[j1] = null;
                            internet_val[j1] = null;
                        }
                    }
                    console.log(hd_val)
                     //if(hd_val.length == 30){
                        json_format = {
                            CPU_Utilization : hd_val,
                            ram_val:ram_val,
                            internet_val: internet_val,
                            date_array : date_array
                        }
                        
                        return res.status(200).send(json_format)
                     //}
                }
            }
            else{
                return res.status(208).send('No data available for the Event id : '+query.event_id+ '  and Event :'+query.event)
            }
        })
    });

});

router.post('/check_event_id', async (req, res) => {
  
    MongoClient.connect()
    .then(async() => {
        const db = MongoClient.db("device_mgt");

        var query={}, dateQuery={}
        if(req.body.event_id === undefined || req.body.event_id === '') {}
        // else query.location = { $in: [ /Ch/i ] } 
        else query.event_id = req.body.event_id
        
    
        if((req.body.start===undefined || req.body.start==='')) {
           await db.collection('event_logs').find({event_id : req.body.event_id }).sort({ $natural: 1}).limit(1).next()
                .then((temp_res, err) => {
                    if(err) console.log(err);
                    console.log(temp_res)
                    if(temp_res != null){
                    var dateTime =  new Date(temp_res.last_modified);
                    // dateTime.setHours(dateTime.getHours() + 5);
                    // dateTime.setMinutes(dateTime.getMinutes() + 30);
                    dateQuery.$gte = dateTime;
                    }
                    else{
                        return res.status(208).send('No data available for the Event Id: '+req.body.event_id);
                    }
                })
                
        }
        else {
            var dateTime =  new Date(req.body.start);
            dateTime.setHours(dateTime.getHours() + 5);
            dateTime.setMinutes(dateTime.getMinutes() + 30);
            dateQuery.$gte = dateTime;
        }
    
        if(req.body.end===undefined || req.body.end==='') {
        }
        else {
            var dateTime =  new Date(req.body.end);
            dateTime.setHours(dateTime.getHours() + 5);
            dateTime.setMinutes(dateTime.getMinutes() + 31);
            dateQuery.$lte = dateTime;
        }
    
        
        
            query.last_modified=dateQuery;
        
        // setTimeout(() => {
            var a =await query;   
            
        // }, 300);
        
            if(a != {}){
                console.log(a)
                db.collection('event_logs').find( a, {projection: { _id: 0, device_model: 1,data: 1,last_modified: 1 }}).toArray()
                    .then((result) => {
                        // console.log(result)
                        if(result.length !== 0 ){ 
                            
                            if(result.length < 30){
                                
                                if(result[0].device_model === 'Windows-10'){    
                                    var count = [];
                                    var json_format = {},date_array = []
                                    result.map((ele, index) => {
                                    date_array.push( ele.last_modified )
                                    count[index] = 1;
                                    })
                                    json_format = {
                                        count : count,
                                        date_array : date_array
                                    }
                                    return res.status(200).send(json_format)
                                }
                                else if(result[0].device_model === 'IoT-Gateway'){
                                    var count = [];
                                    var json_format = {},date_array = []
                                    
                                    result.map((ele, index) => {
                                        date_array.push( ele.last_modified )
                                        count[index] = ele.data.value;
                                        })
                                    json_format = {
                                        count : count,
                                        date_array : date_array
                                    }
                                 
                                    return res.status(200).send(json_format)
                                }
                            }               
                            else{
                                var count = [];
                                var json_format = {},date_array = []
                                if(req.body.end===undefined || req.body.end===''){

                                    var dateTime =  new Date();
                                    dateTime.setHours(dateTime.getHours() + 5);
                                    dateTime.setMinutes(dateTime.getMinutes() + 30);
             
                                }
                                else
                                {
                                var dateTime =  new Date(req.body.end);
                                dateTime.setHours(dateTime.getHours() + 5);
                                dateTime.setMinutes(dateTime.getMinutes() + 30);
                                }
                                if(req.body.start === undefined || req.body.start === ''){
                                    var dateTime1 = new Date( a.last_modified.$gte)
                                    dateTime1.setHours(dateTime1.getHours() - 5);
                                    dateTime1.setMinutes(dateTime1.getMinutes() - 30);
             
                                }
                                else
                                {
                                var dateTime1 =  new Date(req.body.start);
                                dateTime1.setHours(dateTime1.getHours() + 5);
                                dateTime1.setMinutes(dateTime1.getMinutes() + 30);
                                }
                                // var dateTime1 =  new Date(req.body.start);
                                
                                const diffTime = Math.abs(dateTime - dateTime1)/1000;
                                console.log(diffTime + " seconds");
                                const phasetime =diffTime/30
                                console.log(phasetime + " seconds");
                                let start=dateTime1
                                let stop = new Date(dateTime1);
                                console.log('stop0',stop)
                                stop.setSeconds( start.getSeconds() + (phasetime))
                                console.log('stop1',stop)

                              
                                if(result[0].device_model === 'Windows-10'){
                                    for(var i=0 ; i<30;i++){
                                        count[i]=0
                                        let a 
                                        a = start.setSeconds( start.getSeconds() + (phasetime))
            
                                        stop.setSeconds( stop.getSeconds() + (phasetime))
                                        // console.log(start,stop)
                                        result.forEach((ele,index)=>{
                                            var newDate =  new Date(a);
                                            newDate.setHours(newDate.getHours() + 5);
                                            newDate.setMinutes(newDate.getMinutes() + 30);
                                            date_array[i] = newDate;
                                            // if(index == result.length -1)
                                            // {console.log(stop,ele.last_modified)}
                                        if(ele.last_modified >= start && ele.last_modified < stop)
                                        {
                                            //    console.log(start, stop, )
                                            count[i]+=1
                                        }
                                        })
                                    }
                                    
                                    if(count.length == 30){
                                        json_format = {
                                            count : count,
                                            date_array : date_array
                                        }
                                        
                                        return res.status(200).send(json_format)
                                    }
                            }
                            else if(result[0].device_model === 'IoT-Gateway'){
                                
                                for(var i=0 ; i<30;i++){
                                    count[i]=0
                                    let a 
                                    a = start.setSeconds( start.getSeconds() + (phasetime))
        
                                    stop.setSeconds( stop.getSeconds() + (phasetime))
                                    result.forEach((ele,index)=>{
                                        var newDate =  new Date(a);
                                            newDate.setHours(newDate.getHours() + 5);
                                            newDate.setMinutes(newDate.getMinutes() + 30);
                                            date_array[i] = newDate;
        
                                    if(ele.last_modified >= start && ele.last_modified < stop)
                                    {   
                                        count[i] = count[i]+ ele.data.value
                                    }
                                    })

                                }
                             
                                if(count.length == 30){
                                    json_format = {
                                        count : count.map(ele1 => {
                                             return ele1/30
                                        }),
                                        date_array : date_array
                                    }
                                    console.log(json_format)
                                    return res.status(200).send(json_format)
                                }
                            }
                            }
                            
        
        
                        }
                        else{
                            return res.status(208).send('No Data available for the event id '+req.body.event_id); 
                        }
                    })
                }
        
      
    })
    
})

module.exports = router;