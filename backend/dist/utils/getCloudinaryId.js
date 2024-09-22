"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinaryPublicId = void 0;
const getCloudinaryPublicId = (url) => {
    var _a;
    return "med-o-next/product_images/" + ((_a = url.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]);
};
exports.getCloudinaryPublicId = getCloudinaryPublicId;
