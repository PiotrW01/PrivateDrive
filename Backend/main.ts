//require("dotenv").config({ path: path.join(__dirname, ".env") });
import express, { NextFunction, Request, Response } from "express";
import uploadMulter from "./src/controllers/uploadController";
import fController from "./src/controllers/fileController";
import { storagePath } from "./src/config";
import path from "path";
import cors from "cors";
import fs from "fs";
const archiver = require("archiver");

export class Server {
    private app = express();
    private port = 3000;

    constructor() {
        this.app.use(
            cors({
                origin: "http://localhost:4200",
            })
        );
        this.app.use("/", express.static(path.join(__dirname, "public")));
        this.setupRoutes();
    }

    setupRoutes(): void {
        this.app.get("/file/:id", async (req, res) => {
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

        this.app.get("/files", async (req, res) => {
            const files = await fController.readFiles(storagePath);
            res.send(files);
        });

        this.app.get("/zipfiles", async (req, res) => {
            const files = await fController.readFiles(storagePath);
            if (files.length == 0) {
                res.sendStatus(404);
                return;
            }
            res.set({
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename=archive.zip`,
            });

            const archive = archiver("zip", { zlib: { level: 6 } });
            archive.on("error", (err: any) => {
                res.status(500).send();
            });
            archive.directory(storagePath, false);
            archive.pipe(res);
            archive.finalize();
        });

        this.app.post(
            "/upload",
            uploadMulter.single("file"),
            async (req: any, res: Response, next: NextFunction) => {
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
                            console.error(
                                "Error setting file timestamps:",
                                err
                            );
                            return res
                                .status(500)
                                .send("Failed to update timestamps");
                        }
                        res.sendStatus(200);
                    });
                } else {
                    // If no valid lastModified sent, just respond success without changing times
                    res.sendStatus(200);
                }
            }
        );

        this.app.post("/createfolder", async (req, res) => {
            res.sendStatus(501);
        });

        this.app.delete("/removefile", async (req, res) => {
            console.log("A");
            const name = typeof req.query.name === 'string' ? req.query.name : undefined;
            if(!name) {
                res.sendStatus(400);
                return;
            }
            const status = await fController.deleteFile(name, storagePath);
            res.sendStatus(status);
        });
    }

    start(port = this.port): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

if (require.main === module) {
    const server = new Server();
    server.start();
}
