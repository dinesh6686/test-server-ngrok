var expressExtension = require('express-integrator-extension')
var serverFunctions = require('./sample')
var systemToken = 'c4ea21569e0240fd9f80705d85f03ce1'
var options = {
    diy : serverFunctions,
    systemToken : systemToken,
    port :8000
}
console.log("Starting server!!!!!!!!!!");
expressExtension.createServer(options,function(err){
    if(err) {
        console.log("Failed to create the server!Try again later.");
        throw err        
    }
    console.log('Server started!!!');
    
})
