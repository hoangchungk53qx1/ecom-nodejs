const commentRouter = require("./comment");
const userRouter = require("./user");
const productRouter = require("./product");
const menuRouter = require("./menu");
const cardRouter = require("./cart");
const adminRouter = require("./admin");
const bannerRouter = require("./banner");
const searchRouter = require("./search");
// const test = require("./test")
function route(app) {
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/menu", menuRouter);
  app.use("/comment", commentRouter);
  app.use("/card", cardRouter);
  app.use("/admin", adminRouter);
  app.use("/banner", bannerRouter);
  app.use("/search", searchRouter);
  // app.use("/test",test)
}

module.exports = route;
