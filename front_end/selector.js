var Alberta = [
  "BANFF_CANMORE",
  "CALGARY",
  "EDMONTON_AREA",
  "FORT_MCMURRAY",
  "GRANDE_PRAIRIE",
  "LETHBRIDGE",
  "LLOYDMINSTER",
  "MEDICINE_HAT",
  "RED_DEER",
]

var British_columbia = [
  "CARIBOO_AREA",
  "COMOX_VALLEY_AREA",
  "COWICHAN_VALLEY_DUNCAN",
  "CRANBROOK",
  "FRASER_VALLEY",
  "GREATER_VANCOUVER_AREA",
  "KAMLOOPS",
  "KELOWNA",
  "NANAIMO",
  "NELSON",
  "PEACE_RIVER_AREA",
  "PORT_ALBERNI_OCEANSIDE",
  "PORT_HARDY_PORT_MCNEILL",
  "POWELL_RIVER_DISTRICT",
  "PRINCE_GEORGE",
  "REVELSTOKE",
  "SKEENA_BULKLEY_AREA",
  "SUNSHINE_COAST",
  "VERNON",
  "VICTORIA",
  "WHISTLER",
]

var Manitoba = [
  "BRANDON_AREA",
  "FLIN_FLON",
  "THOMPSON",
  "WINNIPEG",
]

var New_brunswick = [
  "BATHURST",
  "EDMUNDSTON",
  "FREDERICTON",
  "MIRAMICHI",
  "MONCTON",
  "SAINT_JOHN",
]

var New_foundland = [
  "CORNER_BROOK",
  "GANDER",
  "LABRADOR",
  "ST_JOHNS",
]

var Nova_scotia = [
  "ANNAPOLIS_VALLEY",
  "BRIDGEWATER",
  "CAPE_BRETON",
  "HALIFAX",
  "NEW_GLASGOW",
  "TRURO",
  "YARMOUTH",
]

var Ontario = [
  "BARRIE",
  "BELLEVILLE_AREA",
  "BRANTFORD",
  "BROCKVILLE",
  "CHATHAM_KENT",
  "CORNWALL",
  "GUELPH",
  "HAMILTON",
  "KAPUSKASING",
  "KENORA",
  "KINGSTON_AREA",
  "KITCHENER_AREA",
  "LEAMINGTON",
  "LONDON",
  "MUSKOKA",
  "NORFOLK_COUNTY",
  "NORTH_BAY",
  "OTTAWA_GATINEAU_AREA",
  "OWEN_SOUND",
  "PETERBOROUGH_AREA",
  "RENFREW_COUNTY_AREA",
  "SARNIA_AREA",
  "SAULT_STE_MARIE",
  "ST_CATHARINES",
  "SUDBURY",
  "THUNDER_BAY",
  "TIMMINS",
  "TORONTO_GTA",
  "WINDSOR_REGION",
  "WOODSTOCK",
]

var Prince_edward_island = [
    "PRINCE_EDWARD_ISLAND",
]

var Quebec = [
    "ABITIBI_TEMISCAMINGUE",
    "BAIE_COMEAU",
    "CENTRE_DU_QUEBEC",
    "CHAUDIERE_APPALACHES",
    "CHIBOUGAMAU_NORTHERN_QUEBEC",
    "GASPE",
    "GRANBY",
    "GREATER_MONTREAL",
    "LANAUDIERE",
    "LAURENTIDES",
    "MAURICIE",
    "QUEBEC_CITY",
    "RIMOUSKI_BAS_ST_LAURENT",
    "SAGUENAY_LAC_SAINT_JEAN",
    "SAINT_HYACINTHE",
    "SAINT_JEAN_SUR_RICHELIEU",
    "SEPT_ILES",
    "SHERBROOKE",
]

var Saskatchewan = [
  "LA_RONGE",
  "MEADOW_LAKE",
  "NIPAWIN",
  "PRINCE_ALBERT",
  "REGINA_AREA",
  "SASKATOON",
  "SWIFT_CURRENT",
]

//TODO: territories and sub-regions are nested

$('#provinceFormControlSelect').on('change', function() {
    console.log(this.value)
    appendToRegionFormControl(this.value)
  });
  
function appendToRegionFormControl(province){
  newitemnum = 2
  newitemdesc = "lol"

  for (int i = 0; i < ; i++){
    $("#regionFormControlSelect").append('<option value="'+i+'" selected="">'+newitemdesc+'</option>');
  }
  
}
$('#submit').click(function(){
  console.log("submit clicked")
})
// $("#myselect").selectpicker();

// $("#add-relish-button").click(function () {
//     var newitemnum = 3;
//     var newitemdesc = "Relish";
//     $("#myselect").append('<option value="'+newitemnum+'" selected="">'+newitemdesc+'</option>');
//     $("#myselect").selectpicker("refresh");
// });

// $("#add-soy-sauce-button").click(function () {
//     var newitemnum = 4;
//     var newitemdesc = "Soy Sauce";
//     $("#myselect").append('<option value="'+newitemnum+'">'+newitemdesc+'</option>');
//     $("#myselect").val(4);
//     $("#myselect").selectpicker("refresh");
// });