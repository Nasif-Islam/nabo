const usersRouter = require("express").Router();

const { getUsers } = require("../controllers/users-controller");

usersRouter.use("api/users", getUsers);
