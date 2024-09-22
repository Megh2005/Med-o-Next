"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const index_js_1 = __importDefault(require("./db/index.js"));
(0, index_js_1.default)()
    .then(() => {
    app_js_1.app.on("error", (error) => {
        console.error(`Error starting app: ${error}`);
        process.exit(1);
    });
    app_js_1.app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
    .catch((error) => {
    console.log(`MongoDB connection failed: ${error}`);
});
