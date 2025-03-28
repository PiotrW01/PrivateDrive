const path = require("path");
const cors = require("cors");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { storagePath } = require("./src/config");
const { readFiles } = require("./src/fsUtils");
const uploadMulter = require("./src/controllers/uploadController");
const admZip = require("adm-zip");
const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:4200",
    })
);
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/files", async (req, res) => {
    const files = await readFiles(storagePath);
    res.send(files);
});

app.get("/zipfiles", async (req, res) => {
    //res.send(await readFiles(storagePath));
    const files = await readFiles(storagePath);
    if (files.length == 0) {
        res.sendStatus(404);
        return;
    }

    var zip = new admZip();
    zip.addLocalFolderAsync(storagePath, (success, err) => {
        if (!success) {
            console.log(err);
        } else {
            const zipBuffer = zip.toBuffer();
            res.set({
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename=archive.zip`,
                "Content-Length": zipBuffer.length,
            });
            res.send(zip.toBuffer());
        }
    });
});

app.post("/upload", uploadMulter.any(), (req, res, next) => {
    if (req.files.length == 0) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
