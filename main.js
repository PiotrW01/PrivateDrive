const path = require('path')
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, ".env")});

const { storagePath } = require('./src/config');
const { readFiles } = require('./src/fsUtils');

const app = express();
const port = 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

app.get("/files", async (req, res) => {
    res.send(await readFiles(storagePath));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})