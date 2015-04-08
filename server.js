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
        var j = 1;

        var canvas = new Canvas(512, 512)
        var ctx = canvas.getContext('2d');

        while(true){ // read in j-th shape parameters and render it
            if ( !('n' + j in req.query && 'x' + j in req.query && 'y' + j in req.query && 'r' + j in req.query)){
                break;
            }
            var n = parseInt(req.query['n' + j]),
                x = parseInt(req.query['x' + j]),
                y = parseInt(req.query['y' + j]),
                radius = parseInt(req.query['r' + j]);


            
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

            j++;
        }
        var stream = canvas.createPNGStream();

        res.type("png");
        stream.pipe(res);
    }

});

app.listen(process.env.PORT || 8000);

