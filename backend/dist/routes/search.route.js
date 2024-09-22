"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const searchRouter = (0, express_1.Router)();
searchRouter.get("/", search_controller_1.search);
exports.default = searchRouter;
