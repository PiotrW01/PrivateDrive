import multer, { StorageEngine, FileFilterCallback } from 'multer';
import fController from "./fileController";
import { storagePath } from "../config";
import { Request } from 'express';
import path from 'path';

// Configure storage engine
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const targetPath = path.join(storagePath, req.body.localPath || '');
    console.log(targetPath);
    cb(null, storagePath);
  },
  filename: (req: Request, file, cb) => {
    cb(null, file.originalname);
  },
});

// Configure filter
const filter = async (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  try {
    const diskFiles = await fController.readFiles(storagePath);

    for (const diskFile of diskFiles) {
      if (file.originalname === diskFile.name) {
        console.log('conflict!');
        console.log(diskFile);
        cb(null, false);
        return;
      }
    }

    cb(null, true);
  } catch (err) {
    cb(err as Error);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // TypeScript does not support async fileFilter directly,
    // so we wrap it
    filter(req, file, cb);
  },
});

export default upload;


/*import multer from 'multer';
const { readFiles } = require("./fileController");
const { storagePath } = require("../config");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(path.join(storagePath, req.body.localPath || ""));
        cb(null, storagePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const filter = async (req, file, cb) => {
    const diskFiles = await readFiles(storagePath);

    for (const diskFile of diskFiles) {
        if (file.originalname === diskFile.name) {
            console.log("conflict!");
            console.log(diskFile);
            cb(null, false);
            return;
        }
    }
    cb(null, true);
};

export default multer({ storage: storage, fileFilter: filter });*/
