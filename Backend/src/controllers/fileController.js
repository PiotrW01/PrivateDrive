const fs = require("fs");
const path = require("path");
const admZip = require("adm-zip");

class FileController {
    constructor() {
        const fileCache = [];
    }

    async deleteFile() {}

    async moveFile() {}

    async createFolder() {}

    async readFiles(directory) {
        const files = [];

        const items = await fs.promises.readdir(directory, {
            withFileTypes: true,
        });

        const promises = items.map(async (item) => {
            if (item.isFile()) {
                const filePath = path.join(directory, item.name);

                try {
                    const stats = await fs.promises.stat(filePath);
                    files.push({
                        name: item.name,
                        birthtime: stats.birthtimeMs,
                        size: stats.size,
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        });

        await Promise.all(promises);
        return files;
    }

    async zipFiles(storagePath) {
        var zip = new admZip();
        await new Promise((resolve, reject) => {
            zip.addLocalFolderAsync(storagePath, (success, err) => {
                if (!success) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("yay!");
                    resolve();
                }
            });
        });
        return zip.toBuffer();
    }

    async getFileData(storagePath, name) {
        var fileData;
        await new Promise((res, rej) => {
            fs.readFile(path.join(storagePath, name), (err, data) => {
                fileData = data;
                res();
            });
        });
        return fileData;
    }
}

const fController = new FileController();

module.exports = fController;
