const loc_dist = require('./loc_dist.js');
const kijiji_data = require('./kijiji_scrapper.js');
var empty = require('is-empty');
const spawn = require("child_process").spawn;

async function get_normalized_data(prov, city, cur_loc){
    let kijiji_listings = await kijiji_data.get_img_and_attr(prov, city);
    //let rating = await get_prediction(kijiji_listings.image_url_list);
    //console.log(rating)
    let kijiji_attr = kijiji_listings.attributes;
    let final_listings = {
        listings:[]
    }
    let distances = [],prices = [], quality = []; 
    var max_dist = Number.MIN_VALUE, min_dist = Number.MAX_VALUE, max_price = Number.MIN_VALUE, min_price = Number.MAX_VALUE;

    for(var i = 0; i < kijiji_attr.length; i++){
        let attr = kijiji_attr[i];
        let distance = await loc_dist.get_dist(cur_loc, attr.location);
        let price = attr.price;
        if(!empty(distance) && distance != false){
            if(distance > max_dist) max_dist = distance;
            if(distance < min_dist) min_dist = distance;
        }
        if(!empty(price) && price != 1){
            if(price > max_price) max_price = price;
            if(price < min_price) min_price = price;
        }
        distances.push(distance);
        prices.push(price);
    }

    //Normalize
    for(var i = 0; i < distances.length; i++){
        //console.log(kijiji_listings.image_url_list[i]);
        
        let rating = await get_prediction(kijiji_listings.image_url_list[i]);

        //console.log(rating.toString('utf8'));        

        let attribute = kijiji_listings.attributes[i];
        var tdist = distances[i], url = attribute.url, tprice = prices[i], desc = attribute.description, address = attribute.address, price = attribute.price
        var images = kijiji_listings.image_url_list[i];
        var distance_norm = Math.abs((distances[i] - min_dist)/(max_dist - min_dist));
        var prices_norm = Math.abs((prices[i] - min_price)/(max_price - min_price));

        console.log(rating);


        var total = distance_norm + prices_norm + rating;

        
        let listing = {
            total_norm: total,
            price: tprice,
            distance: tdist,
            desc: desc,
            address:address,
            images:images,
            url:url
        }
        final_listings.listings.push(listing);
    }
    return final_listings;
}

function get_prediction(data){
     const pythonProcess = spawn('python', ["../ML_Model/predict_simple.py", JSON.stringify(data)]);

     return new Promise((resolve, reject) => {
        let data = pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString('utf8'));
            //resolve(JSON.parse(data))
         });
     })
    
}

function compare(listing_a,listing_b) {
    if (listing_a.total_norm < listing_b.total_norm)
      return -1;
    if (listing_a.total_norm > listing_b.total_norm)
      return 1;
    return 0;
}

module.exports = {
    rank_data: async function (prov, city, cur_loc){
        let norm_data = await get_normalized_data(prov, city, cur_loc);
        norm_data.listings = norm_data.listings.sort(compare);
        return norm_data;
    }
}

// async function test(){
//     await rank_data("ONTARIO", "LONDON", "University of Western Ontario");
// }

// test();

