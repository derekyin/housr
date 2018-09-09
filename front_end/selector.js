//TODO: territories and sub-regions are nested
var obj;

$( document ).ready(function() {
  obj = JSON.parse(data)

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        appendToProvincialFormControl(key)
    }
  }
  $('#provinceFormControlSelect').val(1)
});

$('#provinceFormControlSelect').on('change', function() {
    appendToRegionFormControl(this.value)
});

function ref(obj, str) {
  str = str.split(".");
  for (var i = 0; i < str.length; i++)
      obj = window.obj[str[i]];
  return obj;
}

function appendToRegionFormControl(provinceName){
  
  str = 'obj.'+provinceName
  provinceObject = ref(window.obj, str)
  $('#regionFormControlSelect').children().remove();

  for (var key in provinceObject) {
    if (provinceObject.hasOwnProperty(key)) {
        // console.log(key + " -> " + provinceObject[key]);
        $("#regionFormControlSelect").append('<option value="'+key+'" selected="">'+ key+'</option>');
    }
  }  
}

function appendToProvincialFormControl(province){
    $("#provinceFormControlSelect").append('<option value="'+province+'" selected="">'+ province+'</option>');
}

function get_listings(){
  addr = $("#Address").val()
  prov = $("#provinceFormControlSelect option:selected").val()
  region = $("#regionFormControlSelect option:selected").val()

  var payload = {
    address: addr,
    province: prov,
    city: region
  };

  return new Promise(function (resolve, reject) {
    $.ajax({
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(payload),
        dataType: 'json',
        success: function (listings) {
            $( ".lds-ring" ).hide();
            $(".lds-ring").css('left',"50%");
            listings = JSON.parse(JSON.stringify(listings));
            resolve(listings);
        },
        error: function (err) {
            $( ".lds-ring" ).hide();
            $(".lds-ring").css('left',"50%");
            reject(false);
        },
        processData: false,
        type: 'POST',
        url: 'http://localhost:8000/api/getApts'
      })
  })
}
$('#submit').click(async function(){
  $( ".lds-ring" ).show();
  $(".lds-ring").css('left',"50%");
  var listings = await get_listings();
  localStorage.setItem("listings", JSON.stringify(listings));
  window.location.href='/listings'
})

