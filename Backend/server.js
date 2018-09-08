var express = require('express')
var app = express();
const bodyParser = require('body-parser');
var empty = require('is-empty');
var rank_apts = require('./rank_apts.js')

function get_no_data(){
    return JSON.stringify({data:false});
}

async function getApts(req, res){
    if(empty(req) || empty(req.body)) res.send(get_no_data());

    let body = req.body;

    let central_address = body.address;
    let province = body.province;
    let city = body.city;

    let sorted_listings = rank_apts.rank_data(province, city, central_address);

    if(empty(central_address) || empty(province) || empty(city)) res.send(get_no_data());

    res.send(JSON.stringify({data:true}))
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.post('/api/getApts', [getApts]);

app.set('port', process.env.port || 3000)

app.listen(app.get('port'), () => {
    console.log('App Started on Port: ' + app.get('port'))
})