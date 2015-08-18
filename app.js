// author: Paul Nowak @njet
// licence: MIT
// thanks to KMKBIKES for the public API, and Maciek Banasiewicz @_banasiewicz for the inspirations
// check Maciek's iOS app: https://itunes.apple.com/pl/app/kmkbikes/id966920162?mt=8

var UI = require('ui'); // require to display UI
var ajax = require('ajax'); // require to ask for external data 

// global vars 
var USERlat, USERlong;
var URL = 'https://kmkbike.pl/panel/api/stations/';

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'KRKBIKES',
  subtitle:'The nearest bike station is: ',
  scrollable: true,
  style: 'large'
});

// Display the Card
card.show();

// get the long/lat of the watch 
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

// geo support functions 
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  USERlat = pos.coords.latitude;
  USERlong = pos.coords.longitude;
  // card.body(USERlat + ' / ' + USERlong);
  console.log('==== location ready');
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}





// Make the request for the external data 
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched data! ');
    processData(data); // process this data in a separate function 
  },
  function(error) {
    // Failure!
    console.log('Failed fetching data: ' + error);
  }
);


// process and display data 
function processData (data) {

  // function vars
  var stations = "";
  var closestStationID = 0;
  var lastStationDistance = 9;
  
  // loop through all records 
  for (var station in data) {
  
    // calculcate distance current station and the watch 
    var distance = distanceBetweenTwoPoints(USERlat, USERlong, data[station].latitude, data[station].longitude);

    // list all stations and all of their distances
    console.log(data[station].name + '('+distance+') ');
    
    // if this station distance is smaller than the last one, set it as the closest one
    if (distance < lastStationDistance && distance < 1) {
      lastStationDistance = distance;
      closestStationID = station;
    }
  }
  
  // display information to the user and log it 
  card.body(data[closestStationID].name + ' ('+ data[closestStationID].num_bikes +' bikes, '+ (data[closestStationID].num_racks - data[closestStationID].num_bikes) + ' empty slots, '+decimalDegreesToDistance(lastStationDistance)+' away)');
  console.log('closest station: ' + data[closestStationID].name);
   
}


// helper functions 
function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
}

function decimalDegreesToDistance(dec) {
  return Math.round(dec/0.00001*1.1132) + 'm';
}


