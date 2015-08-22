// jshint devel:true

$(document).ready(function() {

  console.log('\'Allo \'Allo!');

  // Graph system --
  var network = Network.getInstance();
  network.init();
  network.loadData();

  // Game system --
  var game = Game.getInstance();
  game.init();
});
