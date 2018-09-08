const kijiji = require("kijiji-scraper");
var empty = require('is-empty');

async function get_apt_listings(locationId){
    let options = {
        maxResults: 40
    };

    let params = {
        locationId: locationId,
        categoryId: kijiji.categories.REAL_ESTATE.APARTMENTS_AND_CONDOS_FOR_RENT,
        sortByName: "priceAsc"
    };

    return new Promise((resolve, reject) => {
        kijiji.search(params, options).then((ads) => {
            if(empty(ads)) reject(false);
            resolve(ads);
        }).catch(console.error)
    })
}

// async function test(){
//     let img_and_attr = await get_img_and_attr(1700185);
// }

module.exports = {
    get_img_and_attr: async function (locationId) {
        let listings = await get_apt_listings(locationId).catch((err) => {return false});
        if(empty(listings)) return false;
        let listing_data = {
            image_url_list:[],
            attributes:[]
        }
        listings.forEach((listing) => {
            if(!empty(listing.images)){
                listing_data.image_url_list.push(listing.images);
                let attribute = {
                    location:[listing.attributes.location.latitude, listing.attributes.location.longitude],
                    price:listing.attributes.price
                };
                listing_data.attributes.push(attribute);
            }
        })
        return listing_data;
    }
}