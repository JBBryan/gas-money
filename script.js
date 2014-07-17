$(document).ready(function(){

  var userYear = $('#year').val()
  var userMake = $('#make').val()
  var userModel = $('#model').val()
  var userOptions = $('#options').val()

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


  //function for filling makes
  var fillMakes = function(year){
    var api = site + "make?year=" + year;
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + api + '"') + '&format=json&callback=?';
    $.getJSON(yql, function(data){
      var makes = data.query.results.menuItems.menuItem;
      for(var i = 0; i < makes.length; i+= 1){
        $('#make').append('<option>' + makes[i].text + '</option>');
      }
    });
  }
  //Function for filling models
  var fillModels = function(year, make){
    var api = site +"model?year=" + year + "&make=" + make.replace(' ', '+');
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + api + '"') + '&format=json&callback=?';
    $.getJSON(yql, function(data){
      window.data = data;
      var models = data.query.results.menuItems.menuItem;
      for(var i = 0; i < models.length; i++){
        $('#model').append('<option>' + models[i].text + '</option>')
      }
    });
  }
  //Function for filling options
  var fillOptions = function(year, make, model){
    var api = site +"options?year=" + year + "&make=" + make.replace(' ', '+') + "&model=" + model.replace(' ', '+');
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + api + '"') + '&format=json&callback=?';
    $.getJSON(yql, function(data){
      $('#options').empty()
      $('#options').append('<option>Options</options>')
      var options = data.query.results.menuItems.menuItem;
      if(options.length){
        for(var i = 0; i < options.length; i ++){
          $('#options').append('<option data-id="' + options[i].value + '">' + options[i].text + '</option>')
        }
      }
      else{
        $('#options').append('<option data-id="' + options.value + '">' + options.text + '</option>')
      }
    });
  }

$('#year').change(function(e){
  fillMakes(this.value)
});

