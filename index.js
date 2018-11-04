const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, function() {
    mongoose.connect(config.MONGODB_URI,
    { useNewUrlParser: true})
});

const db = mongoose.connection;

db.on('error', function(){ 
    console.log(err)
});

db.once('open', () => {
    require('./routes/customers')(server);
    console.log(`Server started on the server ${config.PORT}`);
}); 