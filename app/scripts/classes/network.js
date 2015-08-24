/**
 * Created by Fanaen on 22/08/2015.
 */

var Network = function () {
  if (Network._instance) { return Network._instance; }
  Network._instance = this;

  // -- Attributes --
  this.width = 960;
  this.height = 500;
  this.selectedNode = undefined;

  this.svg = {};
  this.vis = {};
  this.color = {};
  this.force = {};
  this.zoomer = {};

  this.glink = {};
  this.gghosts = {};
  this.gnode = {};
  this.gfaction = {};

  // -- Methods --
  this.init = function() {

    // Init the frame --
    this.svg = d3.select("body").append("svg");
    this.updateSize();

    this.vis = this.svg.append("svg:g")
      .attr('id', 'vis');

    this.glink    = this.vis.append('svg:g').attr('id', 'glink');
    this.gghosts  = this.vis.append('svg:g').attr('id', 'gghosts');
    this.gnode    = this.vis.append('svg:g').attr('id', 'gnode');
    this.gfaction = this.svg.append('svg:g').attr('id', 'gfaction');

    this.color = d3.scale.category20();

    // Force system --
    this.force = d3.layout.force()
      .charge(-500)
      .linkDistance(100)
      .gravity(.1)
      .size([this.width, this.height]);

    // Zoom system --
    this.zoomer = d3.behavior.zoom()
      .scaleExtent([0.7,3])
      //.on("zoomstart", zoomstart)
      .on("zoom", this.redraw);

    this.svg.call(this.zoomer);
  };

  this.updateSize = function() {

    this.width = $(window).width() - 40;
    this.height = $(window).height() - 40;

    this.svg
      .attr("width", this.width)
      .attr("height", this.height);
  };

  this.redraw = function() {
    Network.getInstance().vis.attr("transform",
      "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  };

  this.loadData = function(level, sublevel) {
    d3.json("data/level-"+ level +"-"+ sublevel +".json", function(error, graph) {
      if (error) {
        var message = "This level does not exists (level-"+ level +"-"+ sublevel +")";
        console.log(message);

        var n = noty({
          text        : message,
          type        : 'error',
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
        return;
        //throw error;
      }

      // -- Post download process --

      // Add the player's faction --
      graph.factions.push({"id": 0, "name": "Player"});

      // -- Use the data --
      Network.getInstance().updateData(graph);

      console.log('Level-'+ level +'-'+ sublevel +': charged');
    });
  };

  this.updateData = function(graph) {

    // Store data --
    this.data = graph;

    // Update physics --
    this.force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    // Update items --
    this
      .updateFactions(graph.factions)
      .updateLinks(graph.links)
      .updateNodes(graph.nodes)
      .updateGhosts(graph.ghosts);

    // Update the locations with the Force, Luke --
    this.force.on("tick", function() {
      Network.getInstance()
        .updateLinksLocation()
        .updateNodesLocation()
        .updateGhostsLocation();
    });

    // Transfer to Game engine --
    Game.getInstance().loadData(graph);

    // Auto select ghost node --
    var node = this.getGhostNode().datum();
    this.selectNode(node);
    Game.getInstance().selectNode(node);
  };

  // Links --

  this.updateLinks = function(data) {
    this.getLinks()
      .data(data)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });
    return this;
  }

  this.updateLinksLocation = function() {
    this.getLinks()
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    return this;
  };

  // Nodes --

  this.updateNodes = function(data) {
    var node = this.getNodes().data(data);

    var node_enter = node.enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .on("click", function(d) {

        Network.getInstance().selectNode(d);

        if (d3.event.defaultPrevented) return; /* ignore drag */

        // Transfer to the game engine --
        Game.getInstance().selectNode(d);

      })
      .on("mousedown.zoom", function() {d3.event.stopPropagation(); }) // Ignore drag/zoom --
      .call(this.force.drag);

    this.restyleNodes(node);

    return this;
  };

  this.selectNode = function(d) {
    if(this.selectedNode != undefined) this.selectedNode.selectedNode = false;
    d.selectedNode = true;
    this.selectedNode = d;
    this.restyleNodes();
  }

  this.restyleNodes = function(node) {
    node = node || this.getNodes();

    var fill = function(d) {
      if(d.dominated == 0) { return "#E74C3C"; }
      if(d.state == "dead") { return "#969696"; }
      else { return Network.getInstance().color(d.faction); } }

    node
      .attr("fill", fill)
      .style("stroke", function(d) { return d.selectedNode ? "#000" : "#263d41"; } );
  };

  this.updateNodesLocation = function() {
    this.getNodes()
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    return this;
  };

  // Ghosts --
  this.updateGhosts = function(data) {
    this.getGhosts().data(data)
      .enter().append("rect")
      .attr("class", "ghost")
      .attr("width", 20)
      .attr("height", 20);
    return this;
  };

  this.updateGhostsLocation = function() {
    this.getGhost()
      .attr("x", function(d) {
        return Network.getInstance().getNodes()
            .filter(function(df, i) { return d.nodeId == df.id; })
            .attr("cx") - 34;
      })
      .attr("y", function(d) {
        return Network.getInstance().getNodes()
            .filter(function(df, i) { return d.nodeId == df.id; })
            .attr("cy") - 10 ;
      });
    return this;
  };

  // Factions --
  this.updateFactions = function(data) {
    var factions = this.getFactions().data(data);

    var factions_enter = factions.enter()
      .append("g")
        .attr("class", "faction")
        .attr("transform", function(d, i) { return "translate(20,"+ (Network.getInstance().height - i * 30 - 50) +")"; });

    factions_enter.append("rect")
      .attr("width", 100)
      .attr("height", 25)
      .attr("fill", function(d) { return d.id == 0 ? "#E74C3C" : Network.getInstance().color(d.id); });

    factions_enter.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text(function(d) { return d.name; });
    return this;
  };

  // Getters & setters --
  this.getFactions  = function() { return this.gfaction.selectAll(".faction"); };
  this.getGhosts    = function() { return this.gghosts.selectAll(".ghost"); };
  this.getLinks     = function() { return this.glink.selectAll(".link"); };
  this.getNodes     = function() { return this.gnode.selectAll(".node"); };

  this.getGhost = function(id) {
    id = id || "player";
    return this.getGhosts().filter(function (d,i) { return d.id === id; });
  };

  this.getGhostNode = function(id) {
    id = id || "player";
    var ghost = this.getGhost(id).datum();
    return this.getNodes().filter(function (d,i) { return d.id === ghost.nodeId; });
  };

  this.getFaction = function(id) {
    return this.getFactions().filter(function (d,i) { return d.id === id; });
  };

  this.getNode = function(id) {
    return this.getNodes().filter(function (d,i) { return d.id === id; });
  }

  this.getSelectedNode = function() {
    return this.getNodes().filter(function (d,i) { return d.selectedNode == true; });
  }

  this.getLinkBetweenNodes = function(id1, id2) {
    return this.getLinks().filter(function (d,i) {
      return (d.source.id == id1 && d.target.id == id2) || (d.target.id == id1 && d.source.id == id2);
    });
  };

  this.getLinkConnectedTo = function(id) {
    return this.getLinks().filter(function (d,i) {
      return d.source.id == id || d.target.id == id;
    });
  }

  this.getLinkToParent = function(id) {
    return this.getLinks().filter(function (d,i) {
      return d.source.id == id;
    });
  }
};

Network.getInstance = function () { return Network._instance || new Network(); }
console.log('Network graph: ready');

