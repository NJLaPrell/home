//'use strict';
 

var  conf = require('./config');
const FauxMo = require('fauxmojs');
var roku = require('./helpers/roku');
 
let fauxMo = new FauxMo(
  {
    ipAddress: conf.localIP,
    devices: [
      {
        name: 'faux television switch',
        port: 11001,
        handler: (action) => {

          console.log("Executing faux tv switch: " + action);

          roku.executeCommand("power-" + action, function(response){
            var payload = {};
            if(response.status!=200){
              console.log("ERROR: " + response.message);
            } else {
              console.log("SUCCESS: " + response.message);
            }
          });

        }
      }
    ]
  });
 
console.log('started..');