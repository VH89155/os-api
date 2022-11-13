const product =require('./product')
const auth = require('./auth');
const cart =require('./cart');
const order =require('./order');
const user = require('./user');
const comment = require('./comment');


function route(app){
    app.use('/v1/product',product);
    app.use('/v1/auth', auth);
    app.use('/v1/cart', cart);
    app.use('/v1/order',order);
    app.use('/v1/user', user);
    app.use('/v1/comment', comment);
}

module.exports =route;