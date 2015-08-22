/**
 * Created by Lifaen on 22/08/2015.
 */


var Game = function () {
  if (Game._instance) { return Game._instance; }
  Game._instance = this;

  // -- Attributes --
  this.selected = {};
  this.data = {};
  this.currentNode = {};

    // -- Methods --
  this.init = function() {

    // Action buttons --
    this.fearButton = $('#fear').on('click', this.onFear);
    this.killButton = $('#kill').on('click', this.onKill);
    this.loveButton = $('#love').on('click', this.onLove);
    this.moveButton = $('#move').on('click', this.onMove);

    this.moveButton.attr('disabled', false);
  };

  this.selectNode = function(data) {
    $('#panel-body-informations').collapse();
    $('#infoName').text(data.name);
  };

  this.loadData = function(data) {
    this.data = data;

    // Change headers --
    $('#level').text(data.level);
    $('#sublevel').text(data.sublevel);
    $('#desc').text(data.desc);


  };

  this.onFear = function() {

  };

  this.onKill = function() {

  };

  this.onLove = function() {

  };

  this.onMove = function() {

  };
};

Game.getInstance = function () { return Game._instance || new Game(); }
console.log('Game system: ready');

// (De)Activate button: $('button').prop('disabled', true);
