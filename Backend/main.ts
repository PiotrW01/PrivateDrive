import path from "path";
require("dotenv").config({ path: path.join(__dirname, ".env") });
import cors from "cors";
import express, {NextFunction, Request, Response} from 'express';
import uploadMulter from "./src/controllers/uploadController";
import fs from 'fs';
import { storagePath } from "./src/config";
import fController from "./src/controllers/fileController";
const app = express();
const port = 3000;

class Server
{
    constructor()
    {
        app.use(
            cors({
                origin: "http://localhost:4200",
            })
        );
        
        app.use("/", express.static(path.join(__dirname, "public")));
        
        app.get("/file/:id", async (req, res) => {
            const files = await fController.readFiles(storagePath);
            for (const file of files) {
                if (file.name === req.params.id) {
                    const filePath = path.join(storagePath, file.name);
                    res.set({
                        "Content-Type": "application/octet-stream",
                        "Content-Disposition": `attachment; filename=${file.name}`,
                        "Content-Length": file.size,
                    });
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                    return;
                }
            }
            res.sendStatus(404);
        });
        
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
            const zipPath = await fController.createZipFile(storagePath);
            res.set({
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename=archive.zip`,
            });
            const readStream = fs.createReadStream(zipPath);
            readStream.on("close", () => {
                fs.rmSync(zipPath);
                console.log("removed temporary zip");
            });
        
            readStream.pipe(res);
        });
        
        app.post("/upload", uploadMulter.single('file'), async (req: Request, res: Response, next: NextFunction) => {
            if (!req.file) {
                res.sendStatus(400);
                return;
            }
            const filePath = path.join(storagePath, req.file!.originalname);
            const lastModified = parseInt(req.body.lastModified, 10);
        
            if (!isNaN(lastModified)) {
                const mtime = new Date(lastModified);
                const atime = new Date();
        
                // Update the file timestamps: access time and modified time
                fs.utimes(filePath, atime, mtime, (err) => {
                if (err) {
                    console.error('Error setting file timestamps:', err);
                    return res.status(500).send('Failed to update timestamps');
                }
                res.sendStatus(200)
                });
            } else {
                // If no valid lastModified sent, just respond success without changing times
                res.sendStatus(200);
            }
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
    }
}

export default new Server();