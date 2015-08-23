/**
 * Created by Lifaen on 22/08/2015.
 */

function stateToString(state) {
  switch (state) {
    case "calm":
      return "Normal";
    case "fear":
      return "Afraid of everything";
    case "love":
      return "In love";
    default:
      return "Unknown";
  }
}

function dominatedToString(dominated) {
  if(dominated < 0) {
    return "Nope";
  }
  else if(dominated == 0) {
    return "Under your control";
  }
  else {
    return "Rival ghost's minion";
  }
}

function resFearToString(number) {
  if(number < 1) {
    return "Afraid of her shadow";
  }
  else if(number >= 1 && number < 3 ) {
    return "Normal";
  }
  else {
    return "Fearless"
  }
}

function resLoveToString(number) {
  if(number < 1) {
    return "You have no idea";
  }
  else if(number >= 1 && number < 3 ) {
    return "Normal";
  }
  else {
    return "Heartless"
  }
}

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
    $('#infoState').text(stateToString(data.state));
    $('#infoDominated').text(dominatedToString(data.dominated));
    $('#infoResistanceFear').text(resFearToString(data.resFear));
    $('#infoResistanceLove').text(resLoveToString(data.resLove));
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
