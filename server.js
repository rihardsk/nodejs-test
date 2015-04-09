var express = require('express');
var Canvas = require('canvas');
var app = express();
var fs = require('fs');

app.get('/', function(req, res) {
    if (Object.keys(req.query).length === 0) { // serve the input form
        fs.readFile('./index.html', function (err, html) {
            if (err) {
                throw err; 
            }
            res.type('html');
            res.send(html);
        });
    }
    else { // render & display the image
        console.log('rendering');
        debugger;
        //console.log(req.query.shapes.n1);

        var canvas = new Canvas(512, 512)
        var ctx = canvas.getContext('2d');

        var parsedShapes = JSON.parse(req.query.shapes); 
        var j = 0;
        for (j = 0; j < parsedShapes.length; j++) { // read in j-th shape parameters and render it
            console.log('shape ' + j);
            var n = parseInt(parsedShapes[j].n),
                x = parseInt(parsedShapes[j].x),
                y = parseInt(parsedShapes[j].y),
                radius = parseInt(parsedShapes[j].r);


            
            var dx = radius;
            var dy = 0;
            
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';

            ctx.beginPath();
             
            var i = 0;
            for (i = 0; i <= n + 1; i++){ // <= n + 1 is a hack to render correctly the starting vertex (at alpha=0)
                var alpha = i * 2 * Math.PI / n;
                dx = Math.floor(Math.cos(alpha) * radius);
                dy = - Math.floor(Math.sin(alpha) * radius);
                ctx.lineTo(x + dx, y + dy);
                console.log('line to', x + dx, y + dy);
            }

            ctx.stroke();

        }
        var stream = canvas.createPNGStream();

        res.type("png");
        stream.pipe(res);
    }

});

app.listen(process.env.PORT || 8000);

