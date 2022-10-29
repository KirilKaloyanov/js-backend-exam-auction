const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const catalogController = require("../controllers/catalogController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/catalog", catalogController);
  app.use("/*", (req, res) => {
    res.render("error", {
      title: "404 Page",
    });
  });
};
