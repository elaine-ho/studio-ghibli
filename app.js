const https = require('https');
const express = require('express')
const app = express();

const port = 3000;
const pageLimit = 16;
const apiUrl = "https://api.jikan.moe/v3/";

var films;
https.get(apiUrl + 'producer/21', (res) => {
    console.log("Called API for producer/21");
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

function lookup(id){
    return new Promise((resolve, reject) =>[
        https.get(apiUrl + 'anime/' + films.anime[id].mal_id, (res) => {
            console.log("Called API for anime/" + films.anime[id].mal_id);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', function(){
                resolve(JSON.parse(data));
            });
        }).on('error', function(e) {
            reject(e);
        })
    ]);
}

function characters(id){
    return new Promise((resolve, reject) =>[
        https.get(apiUrl + 'anime/' + films.anime[id].mal_id + '/characters_staff', (res) => {
            console.log("Called API for " + films.anime[id].mal_id + "/characters_staff");
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', function(){
                resolve(JSON.parse(data));
            });
        }).on('error', function(e) {
            reject(e);
        })
    ]);
}

const asyncMiddleware = fn =>(req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/detail', asyncMiddleware(async (req, res) => { 
    var id = req.query.id;
    if (!films.anime[id].lookup){
        films.anime[id].lookup = await lookup(id);
        
    }
    if (!films.anime[req.query.id].characters){
        films.anime[id].characters = await characters(id);
    }
    res.render('pages/detail',{
        lookup: films.anime[req.query.id].lookup,
        characters: films.anime[req.query.id].characters
    });
}));

app.listen(port);