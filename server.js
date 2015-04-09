var express = require('express');
var Canvas = require('canvas');
var app = express();
var fs = require('fs');


function showIndex(req, res) {
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            throw err; 
        }
        res.type('html');
        res.send(html);
    });
}


function renderShapes(req, res) {
    console.log('rendering');

    var canvas = new Canvas(512, 512)
    var conext = canvas.getContext('2d');

    var parsedShapes = JSON.parse(req.query.shapes); 
    var j = 0;
    for (j = 0; j < parsedShapes.length; j++) { 
        console.log('shape ' + j);
        var n = parseInt(parsedShapes[j].n),
            x = parseInt(parsedShapes[j].x),
            y = parseInt(parsedShapes[j].y),
            radius = parseInt(parsedShapes[j].r);

        drawRegularPolygon(n, x, y, radius, conext);
    }
    var stream = canvas.createPNGStream();

    res.type("png");
    stream.pipe(res);
}


function drawRegularPolygon(numVertices, x, y, radius, conext) {
    var dx = radius;
    var dy = 0;
    
    conext.lineWidth = 1;
    conext.strokeStyle = 'black';

    conext.beginPath();
     
    var i = 0;
    // calculate displacement from x, y for each of polygon vertices using the polar coordinate system
    for (i = 0; i <= numVertices + 1; i++){ // <= numVertices + 1 is a hack to render correctly the starting vertex (at alpha=0)
        var alpha = i * 2 * Math.PI / numVertices;
        dx = Math.floor(Math.cos(alpha) * radius);
        dy = - Math.floor(Math.sin(alpha) * radius);
        conext.lineTo(x + dx, y + dy);
        console.log('line to', x + dx, y + dy);
    }

    conext.stroke();
}


app.get('/', function(req, res) {
    // show index if no query string received
    if (Object.keys(req.query).length === 0) { 
        showIndex(req, res);
    }
    else {
        renderShapes(req, res);
    }
});

app.listen(process.env.PORT || 8000);

