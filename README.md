# Simple Shopping Cart

simple shopping cart using nodejs, mongo db and bootstrap
<br>using dumy data from `product seeder`

### Testing

- install node, mongodb and git
- open cmd and hit `git clone https://github.com/skrskr/Shopping-Cart.git`
- cd `Shopping-Cart` folder
- login to [stripe website](https://stripe.com/) and get your testing `private` and `public` keys
- create `.env` file and add <br>
  `MONGO_DB_PATH = Your_mongodb_path`\
  `STRIPE_PUBLIC_KEY = Your_stripe_public_key`&nbsp;
  `STRIPE_SECERT_KEY = Your_stripe_private_key`&nbsp;

- open cmd hit `mongod` to run mongo db server
- hit `npm install` to install dependencies
- hit `node .\seed\product_seeder.js` to insert dumy data on mongodb
- hit `npm run start` to run server
- open browser and hit `http://localhost:3000`

### Demo

[Video Demo](https://youtu.be/-G1a6cFO8bM)
