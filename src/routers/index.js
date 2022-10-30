const product =require('./product')
const auth = require('./auth');
const cart =require('./cart');

function route(app){
    app.use('/v1/product',product);
    app.use('/v1/auth', auth);
    app.use('/v1/cart', cart);
}

module.exports =route;