const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3050;

app.use(compression());
app.use(express.static(`${__dirname}/client/build`));

// Connect static file serving route
app.all('/*', (req, res) => {
    let buildPath = path.join(__dirname, './client/build');
    let filePath = path.join(buildPath, req.path);
    let indexPath = path.join(buildPath, 'index.html');

    // Serve static files if they exist, otherwise serve index.html
    res.sendFile(fs.existsSync(filePath) ? filePath : indexPath);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
