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

    this.updateActions();

    // Display data --
    data = data || this.selectedNode.datum();
    $('#panel-body-informations').collapse();
    $('#infoName').text(data.name);
    $('#infoState').text(stateToString(data.state));
    $('#infoDominated').text(dominatedToString(data.dominated));
    $('#infoResistanceFear').html(resFearToString(data.resFear));
    $('#infoResistanceLove').html(resLoveToString(data.resLove));
  };

  this.loadData = function(data) {
    this.data = data;

    // Change headers --
    $('#level').text(data.level);
    $('#sublevel').text(data.sublevel);
    $('#desc').text(data.desc);

    this.updateActions();
    this.updateInfoGhost();
  };

  this.onFear = function() {
    if(this.fearPossible) {
      var network = Network.getInstance();
      var ghostNode = network.getGhostNode();
      var ghost = network.getGhost().datum();
      var node = ghostNode.datum();

      if(ghost.attFear >= node.resFear) {
        node.dominated = 0;
        node.state = "fear";

        network.restyleNodes();
        this.increaseLevelFear();

        if (this.checkVictory()) {
          Sound.getInstance().onWin();
        } else {
          Sound.getInstance().onMindControl();
        }

        this.selectNode();
      }
      else {
        Sound.getInstance().onError();
      }
    }
  };

  this.onKill = function() {

  };

  this.onLove = function() {
    if(this.lovePossible) {
      var network = Network.getInstance();
      var ghostNode = network.getGhostNode();
      var ghost = network.getGhost().datum();
      var node = ghostNode.datum();

      if(ghost.attLove >= node.resLove) {
        node.dominated = 0;
        node.state = "love";

        network.restyleNodes();
        this.increaseLevelLove();

        if(this.checkVictory()) {
          Sound.getInstance().onWin();
        } else {
          Sound.getInstance().onMindControl();
        }

        this.selectNode();
      }
      else {
        Sound.getInstance().onError();
      }
    }
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
        Sound.getInstance().onMove();
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
  };

  this.checkVictory = function() {
    var network = Network.getInstance();
    var nodes = network.getNodes().filter(function (d,i) { return d.dominated != 0; });

    var victory = false;
    if(nodes.size() == 0) {
      var victory = true;
      console.log('Victory');
      var n = noty({
        text        : 'Victory! Well done!',
        type        : 'success',
        dismissQueue: true,
        layout      : 'topCenter',
        closeWith   : ['click'],
        theme       : 'relax',
        maxVisible  : 10,
        animation   : {
          open  : 'animated flipInX',
          close : 'animated flipOutX',
          easing: 'swing',
          speed : 500
        }
      });
    }

    return victory;
  };

  this.increaseLevelFear = function() {
    var network = Network.getInstance();
    var ghost = network.getGhost().datum();
    ghost.attFear++;
    network.getGhost().datum(ghost);
    $('#infoAttackFear').html(attFearToString(ghost.attFear));
  }

  this.increaseLevelLove = function() {
    var network = Network.getInstance();
    var ghost = network.getGhost().datum();
    ghost.attLove++;
    network.getGhost().datum(ghost);
    $('#infoAttackLove').html(attLoveToString(ghost.attLove));
  }

  this.updateInfoGhost = function() {
    // Information on the ghost --
    var network = Network.getInstance();
    var ghost = network.getGhost().datum();
    $('#infoAttackFear').html(attFearToString(ghost.attFear));
    $('#infoAttackLove').html(attLoveToString(ghost.attLove));
  }
};

Game.getInstance = function () { return Game._instance || new Game(); }
console.log('Game system: ready');
