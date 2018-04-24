let express = require('express');
let app = express();

app.use(express.static('statics'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/statics/html/follow-fb.html");
});

app.get('/auth/instagram/callback', function (req, res) {
    let respone;
    if (req.query) {
        respone = {
            data: req.query,
            success: true,
            code: 400,
            message: ''
        }
    }
    res.send(JSON.stringify(respone))

});

let server = app.listen(1234, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});