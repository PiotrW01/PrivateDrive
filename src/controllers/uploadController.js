const multer = require('multer');
const { readFiles } = require('../fsUtils');
const { storagePath } = require('../config');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, storagePath);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const filter = async (req, file, cb) => {
    const diskFiles = await readFiles(storagePath);

    for(const diskFile of diskFiles){
        console.log(diskFile);
        if(file.originalname === diskFile){
            console.log("conflict!")
            cb(null, false);
            return;
        }
    }
    cb(null, true);
};

module.exports = multer({storage: storage, fileFilter: filter});