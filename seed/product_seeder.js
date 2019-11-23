const Product = require('../models/product_model');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopingdb');

const products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Product 1',
        description: 'awesome description for product 1',
        price: 10
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/4/41/Arcania_Gothic_4_Game_Cover.jpg',
        title: 'Product 2',
        description: 'awesome description for product 2',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Product 3',
        description: 'awesome description for product 3',
        price: 50
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/4/41/Arcania_Gothic_4_Game_Cover.jpg',
        title: 'Product 4',
        description: 'awesome description for product 4',
        price: 20
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Product 5',
        description: 'awesome description for product 5',
        price: 40
    }),
];

let done = 0;

for(let i = 0; i < products.length; i++)
{
    products[i].save(function(err, result) {
        done++;
        if(done === products.length){
            exitFun();
        }
    })
}
function exitFun() {
    mongoose.disconnect();
}