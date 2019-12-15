module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    let storedItem = this.items[id];
    if (!storedItem)
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;

    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  this.reduceByOne = function(id) {
    let item = this.items[id];
    item.qty--;
    item.price = item.item.price * item.qty;

    this.totalQty--;
    this.totalPrice -= item.item.price;

    if (item.qty <= 0) delete this.items[id];
  };

  this.removeItem = function(id) {
    let item = this.items[id];
    item.price = item.item.price * item.qty;

    this.totalQty -= item.qty;
    this.totalPrice -= item.price;
    delete this.items[id];
  };

  this.generateArray = function() {
    let arr = [];
    for (let id in this.items) arr.push(this.items[id]);
    return arr;
  };
};
