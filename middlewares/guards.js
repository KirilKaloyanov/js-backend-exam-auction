const { getItem } = require("../services/itemService");

function hasUser(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

function isGuest(req, res, next) {
  if (req.user) {
    res.redirect("/"); //TODO: check assignment for correct redirect
  } else {
    next();
  }
}

async function midUser(req, res, next) {
  if (req.user) {
    const item = await getItem(req.params.id);
    // console.log(req.user);

    if (item.owner.toString() === req.user._id) {
      req.user.isOwner = true;
    } else {
      req.user.isVisitor = true;
      if (
        item.subscribeList.map((w) => w.toString()).indexOf(req.user._id) >= 0
      )
        req.user.subscribed = true;
    }
    next();
  } else {
    next();
  }
}

module.exports = {
  hasUser,
  isGuest,
  midUser,
};
