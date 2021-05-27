const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const renderer = require("../services/render");

route.get("/", renderer.home);
route.get("/to-do/:token", renderer.home);
route.get("/admin", renderer.admin);
route.get("/add_user", renderer.add_user);
route.get("/login", renderer.login);
route.get("/update_user", renderer.update_user);
route.get("/about", renderer.about);

//api route for users
route.post("/api/login", controller.login);
route.post("/api/users", controller.create);
route.get("/api/users", controller.find);
route.delete("/api/users/:id", controller.delete);
route.put("/api/users/:id", controller.update);

//api for todo
route.get("/api/get-todo/:token", controller.getTodo);
route.put("/api/post-todo/:token", controller.postTodo);

module.exports = route;