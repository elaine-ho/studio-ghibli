const https = require('https');
const express = require('express')
const app = express();

const port = 3000;

var films;

https.get('https://api.jikan.moe/v3/producer/21', (res) => {
    console.log("Called API");
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', function(){
        films = JSON.parse(data);
    });
});


app.set('view engine', 'ejs');
app.use(express.static("public"));



app.get('/', function(req, res){
    res.render('pages/index',{
        films: films.anime
    });
});

app.listen(port);