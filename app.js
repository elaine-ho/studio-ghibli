const https = require('https');
const express = require('express')
const app = express();

const port = 3000;

const pageLimit = 16;

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
    let page;
    if (!req.query.page){
        page = 1;
    }
    else{
        page = req.query.page;
    }
    const startIndex = (page-1) * pageLimit;
    const endIndex = page * pageLimit;
    const totalPages = Math.ceil(films.anime.length / pageLimit);
    const animes = films.anime.slice(startIndex, endIndex);
    res.render('pages/index',{
        films: animes,
        page: page,
        totalPages: totalPages
    });
});

app.get('/detail', function(req, res){ 
    res.render('pages/detail',{
        id:req.query.id
    });
});

app.listen(port);