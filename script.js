$(document).ready(function(){
  gasPrices = {1984: 1.21, 1985: 1.20, 1986: 0.93, 1987: 0.95, 1988: 1.08, 1989: 1.12,1990: 1.16,1991: 1.14,1992: 1.13,1993: 1.11,1994: 1.11,1995: 1.15,1996: 1.23,1997: 1.23,1998: 1.06,1999: 1.17,2000: 1.49,2001: 1.43,2002: 1.34,2003: 1.56,2004: 1.85,2005: 2.27,2006: 2.58,2007: 2.81,2008: 3.26,2009: 2.35,2010: 2.78,2011: 3.53,2012: 3.60,2013: 3.49,2014: 3.38}
  var userYear = $('#year').val();
  var userMake = $('#make').val();
  var userModel = $('#model').val();
  var userCarId = $('#options').val();
  var userMiles = $('#mileage').val();
  var userMpg = 0;
  var userPrice = 0;
  var userGallons = 0;
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
    $('#make').empty()
    $('#make').append('<option>Make</options>')
    $.getJSON(yql, function(data){
      var makes = data.query.results.menuItems.menuItem;
      for(var i = 0; i < makes.length; i+= 1){
        $('#make').append('<option>' + makes[i].text + '</option>');
      }
    });
  }
  //Function for filling models
  var fillModels = function(year, make){
    var api = site +"model?year=" + year + "&make=" + make.replace(/ /g, '+');
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + api + '"') + '&format=json&callback=?';
    $('#model').empty()
    $('#model').append('<option>Model</options>')
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
    var api = site +"options?year=" + year + "&make=" + make.replace(/ /g, '+') + "&model=" + model.replace(/ /g, '+');
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + api + '"') + '&format=json&callback=?';
    $('#options').empty()
    $('#options').append('<option>Options</options>')
    $.getJSON(yql, function(data){
      var options = data.query.results.menuItems.menuItem;
      //Checks to see if there is one option(object) or many options(array of objects)
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

//Call the fill functions when a selection has been made
$('#year').change(function(e){
  userYear = this.value;
  fillMakes(userYear);
});
$('#make').change(function(e){
  userMake = this.value;
  fillModels(userYear, userMake);
});
$('#model').change(function(e){
  userModel = this.value;
  fillOptions(userYear, userMake, userModel);
});
$('#options').change(function(e){
  userCarId = $(this).find(':selected').data('id');
  console.log(userCarId);;
})

//Function for calculating the average gas price over the years
var priceCalc = function(year){
  var counter = 0;
  var price = 0;
  for(var i = year; i < 2015; i++){
    counter += 1;
    price += gasPrices[i]
    console.log(i);
    console.log(price)
  }
  var result = (price/counter).toString();
  userPrice = result.substring(0,4);
  return userPrice;
}

//Function for calculating the number of gallons consumed(miles/mpg)
var gallonsConsumed = function(miles, mpg){
  var gallons = (miles/mpg).toString();
  var cutOff = gallons.indexOf('.');
  if(cutOff > 0){
    userGallons = gallons.substring(0, cutOff + 3);
    return userGallons;
  }
  else{
    userGallons = gallons + '.00'
    return userGallons;
  };
};
//Function for calculating the total number of dollars spent on gas (galConsumed/avgPrice)
var dollarsSpent = function(gallons, avgPrice){
  var dollars = (gallons*avgPrice).toString();
  var cutOff = dollars.indexOf('.');
  if(cutOff > 0){
    return dollars.substring(0, cutOff + 3)
  }
  else{
    return dollars + ".00";
  };
};
//Hit the api asking for fuel efficiency once everything has been filled out
$('button').click(function(e){
  $('.failure, .success').hide();
  userMiles = $('#mileage').val();
  var api = 'http://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/' + userCarId;
  var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + api + '"') + '&format=json&callback=?';
  $.getJSON(yql, function(data){
    if(data.query.results){
      userMpg = data.query.results.yourMpgVehicle.avgMpg.substring(0,4)
      //Fills the text for the success classes
      $('.mpg').text(userMpg);
      $('.avg-price').text(priceCalc(userYear));
      $('.miles').text(userMiles);
      $('.gallons').text(gallonsConsumed(userMiles, userMpg));
      $('.gas-money').text(dollarsSpent(userGallons, userPrice))
      $('.success').show();
    }
    else{
      $('.failure').show();
    }
  })
})

}); //End document on ready

