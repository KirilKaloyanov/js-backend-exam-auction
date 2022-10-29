const Item = require("../models/Item");
const User = require("../models/User");

async function getAll() {
  try {
    let items = await Item.find({}).lean();
    items = items.filter((i) => !i.subscribeList[1]);
    return items;
  } catch (err) {
    return;
  }
}

async function getAllClosed() {
  try {
    let items = await Item.find({}).lean();
    items = items.filter((i) => i.subscribeList[1]);
    for (let item of items) {
      let userId = item.subscribeList[0];
      const user = await User.findById(userId);
      const userName = `${user.firstName} ${user.lastName}`;
      item.sold = userName;
    }
    return items;
  } catch (err) {
    return;
  }
}

// // PROFILE FILTERING

// async function getAllByUser(userId) {
//   const items = await Item.find({}).lean();
//   return items.filter((b) =>
//     b.wishList.map((b) => b.toString()).includes(userId._id)
//   );
// }

// // SEARCH ENGINE FILTERING
// async function getAllByStr(nameStr, methodStr) {
//   let items = await Item.find({ method: methodStr }).lean();
//   const nameStrI = nameStr.toLowerCase();
//   items = items.filter((i) => i.name.toLowerCase().includes(nameStrI));
//   return items;
// }

async function getItem(itemId) {
  try {
    return await Item.findById(itemId).lean();
  } catch (err) {
    return;
  }
}

async function createItem(item) {
  await Item.create(item);
}

async function subscribeItem(itemId, bid, userId) {
  const item = await Item.findById(itemId);
  if (bid <= item.price) throw new Error("Your bid is not high enough");
  item.price = bid;
  item.subscribeList = [];
  item.subscribeList.push(userId.toString());

  await item.save();
}

async function closeSubscription(itemId) {
  const item = await Item.findById(itemId);
  item.subscribeList.push(true);
  await item.save();
}

async function updateItem(itemId, updatedItem) {
  const item = await Item.findById(itemId);

  Object.assign(item, updatedItem);

  await item.save();
}

async function deleteItem(itemId) {
  await Item.findByIdAndRemove(itemId);
}

module.exports = {
  createItem,
  getAll,
  getAllClosed,
  // getAllByStr,
  // getAllByUser,
  getItem,
  subscribeItem,
  closeSubscription,
  updateItem,
  deleteItem,
};
