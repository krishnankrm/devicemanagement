const net = require('net');

var client = net.connect({port:502, host:"10.1.1.134"},function(){    
    console.log('connected')
});
  
client.on('error', function(err){
    console.log(1)
})
