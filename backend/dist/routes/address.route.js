"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const address_controller_1 = require("../controllers/address.controller");
const addressRouter = (0, express_1.Router)();
addressRouter.get("/", auth_middleware_1.verifyToken, address_controller_1.getAddresses);
addressRouter.post("/", auth_middleware_1.verifyToken, address_controller_1.addNewAddress);
exports.default = addressRouter;
