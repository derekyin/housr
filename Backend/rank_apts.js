const loc_dist = require('./loc_dist.js');
const kijiji_data = require('./kijiji_scrapper.js');
var empty = require('is-empty');


async function get_normalized_data(locationId, cur_loc){
    let kijiji_listings = await kijiji_data.get_img_and_attr(locationId);
    let kijiji_attr = kijiji_listings.attributes;
    let final_listings = {
        listings:[]
    }
    let distances = [],prices = [], quality = []; 
    let max_dist = Number.MIN_VALUE, min_dist = Number.MAX_VALUE, max_price = Number.MIN_VALUE, min_price = Number.MAX_VALUE;

    for(var i = 0; i < kijiji_attr.length; i++){
        let attr = kijiji_attr[i];
        let distance = await loc_dist.get_dist(cur_loc, attr.location);
        let price = attr.price;
        if(!empty(distance) && distance != false){
            if(distance > max_dist) max_dist = distance;
            else if(distance < min_dist) min_dist = distance;
        }
        if(!empty(price) && price != 1){
            if(price > max_price) max_price = price;
            else if(price < min_price) min_price = price;
        }
        distances.push(distance);
        prices.push(price);
    }

    console.log(distances);
    console.log(prices);
    console.log(max_dist + " " + min_dist + " " + max_price + " " + min_price)

}

async function test(){
    await get_normalized_data(1700185, "University of Ottawa");
}

test();