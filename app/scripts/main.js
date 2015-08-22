// jshint devel:true

$(document).ready(function() {

  console.log('\'Allo \'Allo!');

  var network = Network.getInstance();
  network.init();
  network.loadData();
});
