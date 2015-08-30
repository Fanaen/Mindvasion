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

  this.killPossible  = false;
  this.fearPossible  = false;
  this.lovePossible  = false;
  this.movePossible  = false;
  this.swearPossible = false;

    // -- Methods --
  this.init = function() {

    // Action buttons --
    this.fearButton  = $('#fear' ).on('click', function() { Game.getInstance().onFear(); });
    this.killButton  = $('#kill' ).on('click', function() { Game.getInstance().onKill(); });
    this.loveButton  = $('#love' ).on('click', function() { Game.getInstance().onLove(); });
    this.moveButton  = $('#move' ).on('click', function() { Game.getInstance().onMove(); });
    this.swearButton = $('#swear').on('click', function() { Game.getInstance().onSwear(); });
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
    $('#infoLevel').html(levelToString(data.level));
  };

  this.loadData = function(data) {
    this.data = data;

    // Change headers --
    $('#level').html(data.level);
    $('#sublevel').html(data.sublevel);
    $('#desc').html(data.desc);

    this.updateActions();
    this.updateInfoGhost();
  };

  this.onFear = function() {
    if(this.fearPossible) {
      var network = Network.getInstance();
      var ghostNode = network.getGhostNode();
      var ghost = network.getGhost().datum();
      var node = network.getSelectedNode().datum();

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
    if(this.killPossible) {
      var network = Network.getInstance();
      var ghostNode = network.getGhostNode();
      var ghost = network.getGhost().datum();

      var node = network.getSelectedNode();

      // Remove link force --
      var links = network.getLinkConnectedTo(node.datum().id).data().forEach(function (element, index, array) {
        index = network.force.links().indexOf(element);
        network.force.links().splice(index, 1);
      });

      // Remove links shape --
      var links = network.getLinkConnectedTo(node.datum().id).remove();

      // Set dead --
      var datum = node.datum();
      datum.state = "dead";
      node.datum(datum);
      network.restyleNodes();

      if (this.checkVictory()) {
        Sound.getInstance().onWin();
      } else {
        Sound.getInstance().onMindControl();
      }

      network.force.start();
      this.updateActions();

      this.selectNode();
    }
  };

  this.onSwear = function() {
    if(this.swearPossible) {
      var network = Network.getInstance();
      var ghost = network.getGhost().datum();
      var ghostNode = network.getGhostNode();
      var node = network.getSelectedNode();

      // Add  the link --
      var links = network.getLinks().data();
      var link = {"source": ghostNode.datum().id, "target": node.datum().id, "value": 1}// TODO fix dirty trick
      links.push(link);
      network.updateLinks(links);

      network.force.links().push(link);

      Sound.getInstance().onMindControl();
      network.force.start();
      this.updateActions();

      this.selectNode();
      console.log("Yeah!");
    }
  };

  this.onLove = function() {
    if(this.lovePossible) {
      var network = Network.getInstance();
      var ghostNode = network.getGhostNode();
      var ghost = network.getGhost().datum();
      var node = network.getSelectedNode().datum();

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

    var hasParent = true;
    var isReachable = false;

    // Register actions --
    this.movePossible = this.killPossible = this.lovePossible =  this.fearPossible = this.swearPossible = false;
    if(!this.selectedNode.empty()) {

      // Link between selection & current --
      var link = network.getLinkBetweenNodes(this.selectedNode.datum().id, this.currentNode.datum().id);

      var parent = network.getLinkToParent(this.currentNode.datum().id);
      hasParent = !parent.empty();
      isReachable = this.currentNode.datum().level - 1 <= this.selectedNode.datum().level;

      this.movePossible = !link.empty() && this.selectedNode.datum().dominated == 0;
      this.lovePossible = this.fearPossible = !link.empty() && this.selectedNode.datum().dominated != 0;
      this.killPossible = !link.empty() && this.currentNode.datum().dominated == 0;
      this.swearPossible = !hasParent && this.currentNode.datum().dominated == 0 && isReachable
        && this.selectedNode.datum().state != "dead";
    }

    // Update buttons
    this.moveButton.attr('disabled', !this.movePossible);
    this.loveButton.attr('disabled', !this.lovePossible);
    this.fearButton.attr('disabled', !this.fearPossible);
    this.killButton.attr('disabled', !this.killPossible);
    this.swearButton.attr('disabled', !this.swearPossible);
  };

  this.checkVictory = function() {
    var network = Network.getInstance();
    var nodes = network.getNodes().filter(function (d,i) { return d.level == 1 && d.dominated != 0 && d.state != "dead"; });

    var victory = false;
    if(nodes.size() == 0) {
      var victory = true;
      console.log(this.data.nextlevel);
      if(this.data.nextlevel) { // There is a next level --
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

        setTimeout(function(){
          var level = Game.getInstance().data.nextlevel.split('-');
          window.location.replace("?level="+ level[0] +"&sublevel="+ level[1]);
        }, 3000);

      } else { // End of the game --
        var n = noty({
          text        : 'Yay! You finished the game!',
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
