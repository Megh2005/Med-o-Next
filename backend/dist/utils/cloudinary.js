"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
cloudinary_1.v2.config({
    cloud_name: "dutdeodcv",
    api_key: "588452199161783",
    api_secret: "d9xmC81RuqT9zTYGNOWkeCyjKXU", // Click 'View Credentials' below to copy your API secret
});
function uploadImageToCloudinary(localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!localFilePath)
            return;
        const response = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "image",
        });
        promises_1.default.unlink(localFilePath);
        return response;
    });
}
exports.uploadImageToCloudinary = uploadImageToCloudinary;
function deleteImageFromCloudinary(publicId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!publicId)
            return;
        const response = yield cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return response;
    });
}
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
