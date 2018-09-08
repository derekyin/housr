$(document).ready(function() {
    render_template();
})

function render_template(){
    var listings = JSON.parse(localStorage.getItem('listings'));

    //Pre-process data
    for(var i = 0; i < listings.listings.length; i++){
        listings.listings[i]['class'] = (i == 0) ? 'carousel-item active' : 'carousel-item';
        listings.listings[i]['distance'] = Math.round(((listings.listings[i].distance) / 1000) * 10) / 10;
    }

    $("#template").hide();
    template = $('#template').val();
    html = Mustache.render(template, listings);
    $('#result').html(html);
}