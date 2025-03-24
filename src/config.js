const path = require('path');
const os = require('os');
const fs = require('fs');

const storagePath = path.join(os.homedir(), 'PrivateDriveData');

if (!storagePath) {
  console.error("Unsupported OS version");
  process.exit(1);
}

try {
    if(!fs.existsSync(storagePath)){
        fs.mkdirSync(storagePath);
    }
} catch (error) {
    console.error(error);
    process.exit(1);
}

module.exports = { storagePath };