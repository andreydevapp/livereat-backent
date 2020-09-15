"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const environment_1 = require("../global/environment");
aws_sdk_1.default.config.update({
    secretAccessKey: environment_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: environment_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
};
var multerImgUser = multer_1.default({
    fileFilter,
    storage: multer_s3_1.default({
        s3,
        bucket: environment_1.amazonWs3.bucketImgUser,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "hola_amazon", });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
exports.upload = function (req, res) {
    // var file = req.files.file;
    // fs.readFile(file.path, function (err, data) {
    //     if (err) throw err; // Something went wrong!
    //     var s3bucket = new aws.S3({params: {Bucket: amazonWs3.bucketImgNegocios}});
    //     s3bucket.createBucket(function () {
    //         var params = {
    //           Bucket: 'testBucket', // pass your bucket name
    //           Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
    //           Body: JSON.stringify(data, null, 2)
    //         };
    //         s3bucket.upload(params, function (err:any, data:any) {
    //             // Whether there is an error or not, delete the temp file
    //             fs.unlink(file.path, function (err) {
    //                 if (err) {
    //                     console.error(err);
    //                 }
    //                 console.log('Temp File Delete');
    //             });
    //             console.log("PRINT FILE:", file);
    //             if (err) {
    //                 console.log('ERROR MSG: ', err);
    //                 res.status(500).send(err);
    //             } else {
    //                 console.log('Successfully uploaded data');
    //                 res.status(200).end();
    //             }
    //         });
    //     });
    // });
};
var multerImgNegocio = multer_1.default({
    fileFilter,
    storage: multer_s3_1.default({
        s3,
        bucket: environment_1.amazonWs3.bucketImgNegocios,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "hola_amazon" });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
var multerImgPlatillos = multer_1.default({
    fileFilter,
    storage: multer_s3_1.default({
        s3,
        bucket: environment_1.amazonWs3.bucketImgPlatillos,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "hola_amazon" });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
var multerImgBebidas = multer_1.default({
    fileFilter,
    storage: multer_s3_1.default({
        s3,
        bucket: environment_1.amazonWs3.bucketImgBebidas,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "hola_amazon" });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
const destroyImagen = function (bucket, filename, callback) {
    var params = {
        Bucket: bucket,
        Key: filename
    };
    s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        }
        else {
            callback(null);
        }
    });
};
exports.s3ImgUser = multerImgUser;
exports.s3ImgNegocios = multerImgNegocio;
exports.s3ImgPlatillos = multerImgPlatillos;
exports.s3ImgBebidas = multerImgBebidas;
exports.s3DestroyImagen = destroyImagen;
