const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve every static file in this folder (html, css, js)
app.use(express.static(__dirname));

// Default route - if someone visits "/", send them the landing page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Frontend running on http://localhost:${PORT}`);
});