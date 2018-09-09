$(document).ready(function() {
    $('.kara').carousel();
    render_template();
})

function render_template(){
    var listings = JSON.parse(localStorage.getItem('listings'));

    //Pre-process data
    for(var i = 0; i < listings.listings.length; i++){
        listings.listings[i]['class'] = (i == 0) ? 'carousel-item active' : 'carousel-item';
        listings.listings[i]['distance'] = Math.round(((listings.listings[i].distance) / 1000) * 10) / 10;
        listings.listings[i]['carousel_class'] = 'class' + i;
        listings.listings[i]['url_img'] = listings.listings[i].images[0];

        //Pre-process images
        // for(var j = 0; j < listings.listings[i].images.length; j++){
        //     var img_class = (j == 0) ?  'carousel-item active' : 'carousel-item';
        //     var url = listings.listings[i].images[j];
        //     listings.listings[i].images[j] = {
        //         img_class:img_class,
        //         url:url
        //     };
        // }
    }

    console.log(listings);


    $("#template").hide();
    template = $('#template').val();
    html = Mustache.render(template, listings);
    $('#result').html(html);
}