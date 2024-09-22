"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({ origin: "https://med-o-shop-1.onrender.com", credentials: true }));
app.use(express_1.default.json({
    limit: "32kb",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
// routes
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const mainRouter_1 = __importDefault(require("./routes/mainRouter"));
app.use("/api/v1", mainRouter_1.default);
app.use(errorHandler_1.default);
