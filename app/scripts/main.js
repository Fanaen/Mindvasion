// jshint devel:true

// -- URL Parameters --
// Source: http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript

function parse(val) {
  var result = "Not found",
    tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
  }
  return result;
}

// -- Init --

$(document).ready(function() {

  var level = parse('level'),
    sublevel = parse('sublevel');

  console.log('Level: '+ level);
  console.log('Sublevel: '+ sublevel);

  // Charge a level --
  if(!isNaN(level) && !isNaN(sublevel)) {
    console.log('Charging level');

    // Game system --
    var game = Game.getInstance();
    game.init();

    // Graph system --
    var network = Network.getInstance();
    network.init();
    network.loadData(level, sublevel);
  }

  // Load the intro --
  else {
    $('#modalIntro1').modal();
    $('#modalIntro1').on('hide.bs.modal', function (e) {
      // Method 1:
      window.location.replace("?level=0&sublevel=0");

      // Method 2:
      // window.location.href = window.location + "?level=0&sublevel=0";
    })
  }
});
