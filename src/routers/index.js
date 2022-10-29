const product =require('./product')
const auth = require('./auth');

function route(app){
    app.use('/v1/product',product);
    app.use('/v1/auth', auth);
}

module.exports =route;