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
    $('#fear').on('click', this.onFear);
    $('#kill').on('click', this.onKill);
    $('#love').on('click', this.onLove);
    $('#move').on('click', this.onMove);
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
