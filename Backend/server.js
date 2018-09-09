var express = require('express')
var app = express();
const bodyParser = require('body-parser');
var empty = require('is-empty');
var rank_apts = require('./rank_apts.js')
var auth = require('./db.js')

function get_no_data(){
    return JSON.stringify({data:false});
}

function posted(post, msg) {
    return {
        posted: post,
        message: msg
    };
}

async function set_error_login(username, password) {
    if (empty(username) || empty(password)) {
        return (posted(false, "Password OR Username not provided"));
    }
    let login = await auth.login(username, password).catch((err) => {return false;});
    if (!login) {
        return (posted(false, "Invalid Password"));
    }
    return false;
}

async function get_res_login(req, res) {
    if(empty(req) || empty(req.body)) res.send(get_no_data());

    body = req.body;

    let username = body.username;
    let password = body.password;

    let err = await set_error_login(username, password);
    res.status(200);
    if (err) {
        res.send(err);
    } else {
        res.send(posted(true,"Success"));
    }
}

async function get_res_sign_up(req, res){
    if(empty(req) || empty(req.body)) res.send(posted(false,"Error"));

    body = req.body;

    let username = body.username, password = body.password, first = body.first, last = body.last;

    if(empty(username) || empty(password) || empty(first) || empty(last)){
        res.send(posted(false,"Error"));
        return;
    }

    let response = await auth.sign_up(first, last, username, password).catch(err => {return false;});
    if(!response) res.send(posted(false,"Error"));
    else res.send(posted(true,"Success"));
}

async function getApts(req, res){
    if(empty(req) || empty(req.body)) res.send(posted(false,"Error"));

    let body = req.body;

    let central_address = body.address;
    let province = body.province;
    let city = body.city;

    if(empty(central_address) || empty(province) || empty(city)) res.send(posted(false,"Error"));

    let sorted_listings = await rank_apts.rank_data(province, city, central_address);

    res.send(JSON.stringify(sorted_listings));
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.post('/api/getApts', [getApts]);

app.post('/api/login', [get_res_login])

app.post('/api/signUp', [get_res_sign_up])

app.use(express.static('frontend'));

app.set('port', process.env.port || 3000)

app.listen(app.get('port'), () => {
    console.log('App Started on Port: ' + app.get('port'))
})