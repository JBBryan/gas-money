$(document).ready(function(){

  //On ready, fill the '#year' selector with valid years

  //url that returns xml of all the years available to look at gas mileage
  var site = 'http://www.fueleconomy.gov/ws/rest/vehicle/menu/year';
  //url of a proxy server that converts xml to yql, allowing for a cross domain
  //ajax request
  var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
  // Request that YSQL string, and run a callback function.
  // Pass a defined function to prevent cache-busting.
  $.getJSON(yql, function(data){
      window.data = data;
      var years = data.results[0].match(/\d+/g);
      for(var i = 0; i < years.length; i+=2){
        $('#year').append('<option>' + years[i] + '</option>');
      }
  });

})
