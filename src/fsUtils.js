const fs = require("fs");
const path = require("path");

async function readFiles(directory) {
    const files = [];

    const items = await fs.promises.readdir(directory, { withFileTypes: true });

    const promises = items.map(async (item) => {
        if (item.isFile()) {
            const filePath = path.join(directory, item.name);

            try {
                const stats = await fs.promises.stat(filePath);
                console.log(stats);
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

module.exports = { readFiles };
