var request = require('request');
var empty = require('is-empty');
const appendQuery = require('append-query')

function get_loc_obj(loc){
    if(empty(loc)) return false;

    let uri = 'https://maps.googleapis.com/maps/api/geocode/json';

    let params = {
        address:loc,
        key:process.env.google_api_key
    }

    let url = appendQuery(uri, params);

    return new Promise((resolve, reject) => {
        request({
            "method": "GET",
            "uri": url,
            "json": true,
        }, (error, response, body) => {
            if(empty(body)) reject(false);
            else resolve(body);
        });
    })
}

async function get_long_and_lat(loc){
    let loc_obj = await get_loc_obj(loc);
    if(!loc_obj || empty(loc_obj.results[0]) || empty(loc_obj.results[0].geometry) || empty(loc_obj.results[0].geometry.location)) return false;

    let loc_coords = loc_obj.results[0].geometry.location;
    return [loc_coords.lat, loc_coords.lng];
}

async function get_dist_obj(cur_loc_address, target_loc_coords){
    let cur_loc_coords = await get_long_and_lat(cur_loc_address);

    if(empty(cur_loc_address)) return false;

    if(target_loc_coords.length != 2) return false;

    let uri = 'https://maps.googleapis.com/maps/api/distancematrix/json';

    let params = {
        units:"metric",
        origins:`${cur_loc_coords[0]}, ${cur_loc_coords[1]}`,
        destinations:`${target_loc_coords[0]}, ${target_loc_coords[1]}`,
        key:process.env.google_api_key,
        mode:"driving"
    }

    let url = appendQuery(uri, params);

    return new Promise((resolve, reject) => {
        request({
            "method": "GET",
            "uri": url,
            "json": true,
        }, (error, response, body) => {
            if(empty(body)) reject(false);
            else resolve(body);
        });
    })
}

module.exports = {
    /**
     * 
     * @param {*} cur_loc_address is string address
     * @param {*} target_loc_coords is [lat, long]
     */
    get_dist: async function(cur_loc_address, target_loc_coords){
        let dist_obj = await get_dist_obj(cur_loc_address, target_loc_coords);
        if(empty(dist_obj) || empty(dist_obj.rows[0]) || empty(dist_obj.rows[0].elements[0])
        || empty(dist_obj.rows[0].elements[0].distance)){
            return false;
        }
        return dist_obj.rows[0].elements[0].distance.value;
    }
}