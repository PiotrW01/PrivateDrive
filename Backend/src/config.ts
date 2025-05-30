import path from "path";
import os from "os";
import fs from "fs";

/* ***************** */
/* ***************** */
const windowsPath: string = "";
const windowsTempPath: string = "";
const linuxPath: string = "/var/www/drivedata";
const linuxTempPath: string = "";
/* ***************** */

const platform = os.platform();
let _tempPath: string = "";
let _storagePath: string = "";

if (platform === "win32") {
    if(windowsPath === ""){
        _storagePath = path.join(os.homedir(), "PrivateDriveData");
    }
    else {
        _storagePath = windowsPath;
    }

    if(windowsTempPath === ""){
        _tempPath = os.tmpdir();
        
    }
    else{
        _tempPath = windowsTempPath;
    }
}
else if(platform === "linux"){
    if(linuxPath === ""){
        _storagePath = path.join(os.homedir(), "PrivateDriveData");
    }
    else {
        _storagePath = linuxPath;
    }

    if(linuxTempPath === ""){
        _tempPath = os.tmpdir();
    }
    else{
        _tempPath = linuxTempPath;
    }
}

if (_storagePath === "" || _tempPath === "") {
    console.error("Unsupported OS version");
    process.exit(1);
}

try {
    if (!fs.existsSync(_storagePath)) {
        fs.mkdirSync(_storagePath);
    }
} catch (error) {
    console.error(error);
    process.exit(1);
}

export const tempPath = _tempPath;
export const storagePath = _storagePath;
