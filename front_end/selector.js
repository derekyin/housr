//TODO: territories and sub-regions are nested
var obj;

$( document ).ready(function() {
  obj = JSON.parse(data)
  console.log(obj)

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key + " -> " + obj[key]);
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
        console.log(key + " -> " + provinceObject[key]);
        $("#regionFormControlSelect").append('<option value="'+key+'" selected="">'+ key+'</option>');
    }
  }  
}

function appendToProvincialFormControl(province){
    $("#provinceFormControlSelect").append('<option value="'+province+'" selected="">'+ province+'</option>');
}
$('#submit').click(function(){
  console.log("submit clicked")
})
