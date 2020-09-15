import aws from 'aws-sdk'; 
import multer from 'multer';
import multerS3 from 'multer-s3';
import uuid from 'uuid/v4';
import path from 'path';
import fs from 'fs';
import {amazonWs3} from '../global/environment';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});

const s3 = new aws.S3();

const fileFilter = (req:any, file:any, cb:any) => {
    console.log(file.mimetype);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
  }
 
var multerImgUser = multer({
    fileFilter,
    storage: multerS3({
    s3,
    bucket: amazonWs3.bucketImgUser,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "hola_amazon",});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

exports.upload = function (req:any, res:any) {
  


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

var multerImgNegocio = multer({
    fileFilter,
    storage: multerS3({
    s3,
    bucket: amazonWs3.bucketImgNegocios,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "hola_amazon"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

var multerImgPlatillos = multer({
    fileFilter,
    storage: multerS3({
    s3,
    bucket: amazonWs3.bucketImgPlatillos,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "hola_amazon"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

var multerImgBebidas = multer({
    fileFilter,
    storage: multerS3({
    s3,
    bucket: amazonWs3.bucketImgBebidas,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "hola_amazon"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

const destroyImagen = function(bucket:string, filename:string, callback:any) {
    var params = {
      Bucket: bucket,
      Key: filename
    };
    s3.deleteObject(params, function(err, data) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null);
      }
    });
  }

export const s3ImgUser = multerImgUser;
export const s3ImgNegocios = multerImgNegocio;
export const s3ImgPlatillos = multerImgPlatillos;
export const s3ImgBebidas = multerImgBebidas;
export const s3DestroyImagen = destroyImagen;