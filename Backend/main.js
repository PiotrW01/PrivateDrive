const path = require("path");
const cors = require("cors");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { storagePath } = require("./src/config");
const fController = require("./src/controllers/fileController");
const uploadMulter = require("./src/controllers/uploadController");
const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:4200",
    })
);
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/files", async (req, res) => {
    const files = await fController.readFiles(storagePath);
    res.send(files);
});

app.get("/zipfiles", async (req, res) => {
    const files = await fController.readFiles(storagePath);
    if (files.length == 0) {
        res.sendStatus(404);
        return;
    }
    const zipBuffer = await fController.zipFiles(storagePath);
    if (zipBuffer) {
        res.set({
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename=archive.zip`,
            "Content-Length": zipBuffer.length,
        });
        res.send(zipBuffer);
    } else {
        res.sendStatus(500);
    }
});

app.post("/upload", uploadMulter.any(), async (req, res, next) => {
    if (req.files.length == 0) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

app.post("/createfolder", async (req, res) => {
    res.sendStatus(501);
});

app.delete("/removefile", async (req, res) => {
    res.sendStatus(501);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
