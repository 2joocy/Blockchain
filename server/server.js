var net = require('net');
 
let connArr = [];
 
// Every hour ping every ip in connArr
const intervalID = setInterval(() => {
  console.log(connArr);
    connArr.forEach((e) => {
      let client = new net.Socket();
      client.connect(8585, e, function(){
        client.write(JSON.stringify({action: 0}));
      });
 
      client.on('data', function(data) {
        console.log('Received: ' + data);
        data.forEach((el) => {
          if(!connArr.includes(el)){
            connArr.push(el);
          }
        });
        client.destroy();
      });
 
      client.on('error', function(err){
        connArr = connArr.filter((el) => {
          return (el !== e);
        });
        console.error(err);
        client.destroy();
      });
    });
}, 1000);
 
 
var server = net.createServer(function(socket) {
  socket.on('data', (data) => {
    let dataInt = JSON.parse(data.toString('utf8')).action;
    console.log(dataInt);
    if(dataInt === 0){ // get
      if(!connArr.includes(socket.remoteAddress)){
        connArr.push(socket.remoteAddress);
      }
      socket.write(JSON.stringify({action: 1, data: connArr}));
    }
    else{
      console.error('Illegal Data');
    }
  });
  console.log(JSON.stringify(connArr));
});
 
server.listen(8585);
