import { Item } from "../interfaces/item";
import { tempPath } from '../config';
import { randomUUID } from "crypto";
import admZip from "adm-zip";
import path from "path";
import fs from "fs";

class FileController {
    private itemCache: Item[] = [];

    async deleteFile() {}

    async moveFile() {}

    async createFolder() {}

    async readFiles(directory: string): Promise<Item[]> {
        const tempItems: Item[] = [];

        const items = await fs.promises.readdir(directory, {
            withFileTypes: true,
        });

        const promises = items.map(async (item) => {
            if (item.isFile()) {
                const filePath = path.join(directory, item.name);

                try {
                    const stats = await fs.promises.stat(filePath);
                    tempItems.push({
                        name: item.name,
                        birthtime: stats.birthtimeMs,
                        lastModified: stats.mtime,
                        size: stats.size
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        });

        await Promise.all(promises);
        return tempItems;
    }

    async createZipFile(storagePath: string): Promise<string> {
        var zip = new admZip();
        const id = randomUUID();
        const filePath = path.join(tempPath, id);
        await new Promise((resolve, reject) => {
            zip.addLocalFolderAsync(storagePath, (success, err) => {
                if (!success) {
                    console.log(err);
                    reject(err);
                } else {
                    zip.writeZip(filePath, (err) => {
                        console.log("yay!");
                        resolve(0);
                    });
                }
            });
        });
        return filePath;
    }

    async getFileData(storagePath: string, name: string) {
        var fileData;
        await new Promise((resolve, reject) => {
            fs.readFile(path.join(storagePath, name), (err, data) => {
                fileData = data;
                resolve(0);
            });
        });
        return fileData;
    }
}

export default new FileController();
