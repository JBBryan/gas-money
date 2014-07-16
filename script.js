$(document).ready(function(){
  //On ready, fill the '#year' selector with valid years

  //url that returns xml of all the years available to look at gas mileage
  var site = 'http://www.fueleconomy.gov/ws/rest/vehicle/menu/';
  //url of a proxy server that converts xml to yql, allowing for a cross domain
  //ajax request
  var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + "year" + '"') + '&format=xml&callback=?';
  // Request that YSQL string, and run a callback function.
  // Pass a defined function to prevent cache-busting.
  $.getJSON(yql, function(data){

      var years = data.results[0].match(/\d+/g);
      for(var i = 0; i < years.length; i+=2){
        $('#year').append('<option>' + years[i] + '</option>');
      }
  });

  //Regex for finding data between > and <
  var regex = "/<text>(.*)<\/text>/"
  fillMakes = function(year){
    site = site + "make?year=" + year;
    // yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
    var yql = 'http://query.yahooapis.com/v1/public/yql?'
            + 'q=' + encodeURIComponent('select * from json where url=@url')
            + '&url=' + encodeURIComponent(site)
            + '&format=json&callback=?';
    $.getJSON(yql, function(data){
      window.data = data;
    });
  }

})
