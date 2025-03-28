const multer = require("multer");
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

module.exports = multer({ storage: storage, fileFilter: filter });
