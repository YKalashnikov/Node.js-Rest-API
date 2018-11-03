const restify = requier('restify');
const mongoose = require('mpngoose');
const config = requre('./config');

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(config.PORT, ()=> {
    mongoose.connect(config.MONGOOSE_URL,
    { useNewUrlParser: true})
});

const db = mongoose.connection;

db.on('error', err => console.log(err))

db.once('open', () => {
    require('./routes/customers')(server);
    console.log(`Server started on the server ${config.PORT}`);
}); 