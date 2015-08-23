/**
 * Created by Lifaen on 22/08/2015.
 */

var Game = function () {
  if (Game._instance) { return Game._instance; }
  Game._instance = this;

  // -- Attributes --
  this.data = {};

  this.selectedNode = {};
  this.currentNode = {};

  this.killPossible = false;
  this.fearPossible = false;
  this.lovePossible = false;
  this.movePossible = false;

    // -- Methods --
  this.init = function() {

    // Action buttons --
    this.fearButton = $('#fear').on('click', function() { Game.getInstance().onFear(); });
    this.killButton = $('#kill').on('click', function() { Game.getInstance().onKill(); });
    this.loveButton = $('#love').on('click', function() { Game.getInstance().onLove(); });
    this.moveButton = $('#move').on('click', function() { Game.getInstance().onMove(); });
  };

  this.selectNode = function(data) {

    // Display data --
    $('#panel-body-informations').collapse();
    $('#infoName').text(data.name);
    $('#infoState').text(stateToString(data.state));
    $('#infoDominated').text(dominatedToString(data.dominated));
    $('#infoResistanceFear').text(resFearToString(data.resFear));
    $('#infoResistanceLove').text(resLoveToString(data.resLove));

    this.updateActions();
  };

  this.loadData = function(data) {
    this.data = data;

    // Change headers --
    $('#level').text(data.level);
    $('#sublevel').text(data.sublevel);
    $('#desc').text(data.desc);

    this.updateActions();
  };

  this.onFear = function() {

  };

  this.onKill = function() {

  };

  this.onLove = function() {

  };

  this.onMove = function() {
    if(this.movePossible) {
      var network = Network.getInstance();
      var ghost = network.getGhost();

      if(!ghost.empty()) {
        var datum = ghost.datum();
        datum.nodeId = this.selectedNode.datum().id;
        ghost.datum(datum);

        // Update the network graph and rerun action checks
        network.force.start();
        this.updateActions();
      }
    }
  };

  this.updateActions = function() {
    // Check actions possibilities --
    var network = Network.getInstance();
    this.selectedNode = network.getSelectedNode();
    this.currentNode = network.getGhostNode();

    if(!this.selectedNode.empty())
      var link = network.getLinkBetweenNodes(this.selectedNode.datum().id, this.currentNode.datum().id);

    // Register actions --
    this.movePossible = link != undefined && !link.empty();
    this.lovePossible = this.fearPossible = this.currentNode.datum().dominated != 0;

    // Update buttons
    this.moveButton.attr('disabled', !this.movePossible);
    this.loveButton.attr('disabled', !this.lovePossible);
    this.fearButton.attr('disabled', !this.fearPossible);
  }
};

Game.getInstance = function () { return Game._instance || new Game(); }
console.log('Game system: ready');

// (De)Activate button: $('button').prop('disabled', true);
