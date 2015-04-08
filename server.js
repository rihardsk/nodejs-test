var express = require('express');
var Canvas = require('canvas');
var app = express();

app.get('/', function(req, res) {

    var n = parseInt(req.query.n1),
        x = parseInt(req.query.x1),
        y = parseInt(req.query.y1),
        radius = parseInt(req.query.r1);

    var canvas = new Canvas(512, 512)
    var ctx = canvas.getContext('2d');
    
    var dx = radius;
    var dy = 0;
    
    //ctx.strokeStyle = 'rgba(0,0,0,0.5)';    
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';


    //ctx.beginPath(x + dx, y + dy);
    ctx.beginPath();
     
    var i = 0;
    for (i = 0; i <= n + 1; i++){ // <= n + 1 is a hack to render correctly the starting vertex (at alpha=0)
        var alpha = i * 2 * Math.PI / n;
        console.log(alpha);
        console.log(Math.cos(alpha));
        console.log(radius);
        dx = Math.floor(Math.cos(alpha) * radius);
        console.log(dx);
        dy = - Math.floor(Math.sin(alpha) * radius);
        ctx.lineTo(x + dx, y + dy);
        console.log('line to', x + dx, y + dy);
    }

    // ctx.lineWidth = 7;
    // ctx.strokeStyle = 'black';
    ctx.stroke();

    /*
    ctx.font = '30px Impact';
    ctx.rotate(.1);
    ctx.fillText("Awesome!", 50, 100);
    
    var te = ctx.measureText('Awesome!');
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.lineTo(60, 102);
    ctx.lineTo(50 + te.width, 102);
    ctx.stroke(); 
    */
    //ctx.fillStyle = "darkblue";
    //ctx.font = "bold 16px Arial";
    //ctx.fillText(z + "/" + x + "/" + y, 100, 128);
    /*
    ctx.beginPath();
    ctx.rect(0, 0, 256, 256);

    ctx.lineWidth = 7;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    */
    var stream = canvas.createPNGStream();

    res.type("png");
    stream.pipe(res);

});

app.listen(process.env.PORT || 8000);

