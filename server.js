var http = require('http');
var fs = require('fs');
var path = require('path');

var port = 3200;

var mimeTypes = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.wav': 'audio/wav'
};

http.createServer(function (request, response) {
    console.log('request starting...');

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = mimeTypes[extname] || 'text/html';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                // could redirect here to a 404,
                response.writeHead(404, "File not found");
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);
console.log(['Server running at http://127.0.0.1:', port, '/'].join(""));
