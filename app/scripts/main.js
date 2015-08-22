// jshint devel:true

$(document).ready(function() {

  console.log('\'Allo \'Allo!');

  // Game system --
  var game = Game.getInstance();
  game.init();

  // Graph system --
  var network = Network.getInstance();
  network.init();
  network.loadData(0, 0);
});
