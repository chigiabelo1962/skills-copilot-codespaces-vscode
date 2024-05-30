// Create web server
// Create a new instance of the http.Server object
const server = http.createServer((req, res) => {
    // Check if the request is a POST request
    if (req.method === 'POST') {
        // Create a new instance of the Busboy object
        const busboy = new Busboy({ headers: req.headers });
        // Create a new array to store the files
        const files = [];
        // Create a new object to store the fields
        const fields = {};
        // Listen for the file event
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            // Create a new temporary file
            const filepath = path.join(os.tmpdir(), filename);
            // Push the file path to the files array
            files.push(filepath);
            // Create a write stream
            file.pipe(fs.createWriteStream(filepath));
        });
        // Listen for the field event
        busboy.on('field', (fieldname, value) => {
            // Add the field to the fields object
            fields[fieldname] = value;
        });
        // Listen for the finish event
        busboy.on('finish', () => {
            // Create a new comment object
            const comment = {
                name: fields.name,
                email: fields.email,
                message: fields.message,
                files: files
            };
            // Respond with the comment object
            res.end(JSON.stringify(comment, null, 2));
        });
        // Pipe the request to the busboy object
        req.pipe(busboy);
    } else {
        // Respond with a 405 Method Not Allowed status code
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});
// Listen for requests on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
