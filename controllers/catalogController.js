const catalogController = require("express").Router();
const { hasUser, midUser } = require("../middlewares/guards");
const { parseError } = require("../util/parser");
const {
  getAll,
  getAllByStr,
  getItem,
  createItem,
  subscribeItem,
  closeSubscription,
  updateItem,
  deleteItem,
  getAllClosed,
} = require("../services/itemService");
const { getUser } = require("../services/userService");
const Item = require("../models/Item");

// GET ITEMS

catalogController.get("/", async (req, res) => {
  const items = await getAll();
  res.render("catalog", {
    title: "Catalog",
    items,
  });
});

catalogController.get("/closed", async (req, res) => {
  const items = await getAllClosed();
  res.render("closed", {
    title: "Closed Auctions",
    items,
  });
});

//CREATE ITEM
catalogController.get("/create", hasUser, (req, res) => {
  res.render("create", {
    title: "Create Page",
  });
});

catalogController.post("/create", async (req, res) => {
  const item = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    price: Number(req.body.price),
    owner: req.user._id,
  };

  try {
    if (item.name == "" || item.description == "" || item.price == "")
      throw new Error("Title, desctiption and price fields are required");

    await createItem(item);
    res.redirect("/catalog");
  } catch (err) {
    const errors = parseError(err);
    res.render("create", {
      title: "Create Page",
      body: {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
      },
      errors,
    });
  }
});

//ITEM DETAILS

catalogController.get("/details/:id", midUser, async (req, res) => {
  const itemId = req.params.id;
  const item = await getItem(itemId);
  if (!item) return res.render("error");
  const bidder = await getUser(item.subscribeList[0]);
  const user = req.user;
  const author = await getUser(item.owner);

  res.render("details", {
    title: "Details Page",
    item,
    user,
    author,
    bidder,
  });
});

// SUBSCRIBE

catalogController.post(
  "/subscribe/:id",
  [hasUser, midUser],
  async (req, res) => {
    const itemId = req.params.id;
    const item = await getItem(itemId);
    const user = req.user;
    const author = await getUser(item.owner);

    try {
      if (user.subscribe)
        throw new Error("You have already the current bidder");

      await subscribeItem(itemId, req.body.bid, user._id);
      res.redirect(`/catalog/details/${itemId}`);
    } catch (err) {
      res.render("details", {
        title: "Details Page",
        item,
        user,
        author,
        errors: parseError(err),
      });
    }
  }
);

catalogController.get("/close/:id", [hasUser, midUser], async (req, res) => {
  await closeSubscription(req.params.id);
  res.redirect("/catalog/closed");
});

//EDIT ITEM

catalogController.get("/edit/:id", [hasUser, midUser], async (req, res) => {
  const itemId = req.params.id;
  const item = await getItem(itemId);
  const user = req.user;
  const bidder = await getUser(item.subscribeList[0]);

  if (!user.isOwner) return res.redirect("/error");

  res.render("edit", {
    title: "Edit Page",
    item,
    bidder,
  });
});

catalogController.post("/edit/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await updateItem(itemId, req.body);
    res.redirect(`/catalog/details/${itemId}`);
  } catch (err) {
    res.render("edit", {
      title: "Edit Page",
      body: {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
      },
      errors: parseError(err),
    });
  }
});

//DELETE ITEM

catalogController.get("/delete/:id", [hasUser, midUser], async (req, res) => {
  const itemId = req.params.id;
  const user = req.user;

  if (!user.isOwner) return res.redirect("/error");

  await deleteItem(itemId, req.body);
  res.redirect(`/catalog`);
});

module.exports = catalogController;
