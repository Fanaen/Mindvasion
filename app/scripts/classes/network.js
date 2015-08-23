/**
 * Created by Fanaen on 22/08/2015.
 */

var Network = function () {
  if (Network._instance) { return Network._instance; }
  Network._instance = this;

  // -- Attributes --
  this.width = 960;
  this.height = 500;
  this.selected = undefined;

  this.svg = {};
  this.vis = {};
  this.color = {};
  this.force = {};
  this.zoomer = {};

  // -- Methods --
  this.init = function() {

    // Init the frame --
    this.svg = d3.select("body").append("svg");
    this.updateSize();

    this.vis = this.svg.append("svg:g")
      .attr('id', 'vis');

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
      if (error) throw error;

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
  };

  // Links --

  this.updateLinks = function(data) {
    this.vis.selectAll(".link")
      .data(data)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });
    return this;
  }

  this.updateLinksLocation = function() {
    this.vis.selectAll(".link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    return this;
  };

  // Nodes --

  this.updateNodes = function(data) {
    var node = this.vis.selectAll(".node")
      .data(data);

    var node_enter = node.enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .on("click", function(d) {

        // Selection system --
        var network = Network.getInstance();
        if(network.selected != undefined) network.selected.selected = false;
        d.selected = true;
        network.selected = d;
        network.restyleNodes(node);

        if (d3.event.defaultPrevented) return; /* ignore drag */

        // Transfer to the game engine --
        Game.getInstance().selectNode(d);

      })
      .on("mousedown.zoom", function() {d3.event.stopPropagation(); }) // Ignore drag/zoom --
      .call(this.force.drag);

    this.restyleNodes(node);

    node_enter.append("title")
      .text(function(d) { return d.name; });

    return this;
  };

  this.restyleNodes = function(node) {
    var fill = function(d) {
      if(d.dominated == 0) { return "#E74C3C"; }
      else { return Network.getInstance().color(d.group); } }

    node
      .attr("fill", fill)
      .style("stroke", function(d) { return d.selected ? "#000" : "#263d41"; } );
  };

  this.updateNodesLocation = function() {
    this.vis.selectAll(".node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    return this;
  };

  // Ghosts --
  this.updateGhosts = function(data) {
    this.setGhosts(data)
      .enter().append("rect")
      .attr("class", "ghost")
      .attr("width", 20)
      .attr("height", 20);
    return this;
  };

  this.updateGhostsLocation = function() {
    this.vis.selectAll(".ghost")
      .attr("x", function(d) {
        return Network.getInstance().vis.selectAll(".node")
            .filter(function(df, i) { return d.node == df.id; })
            .attr("cx") - 34;
      })
      .attr("y", function(d) {
        return Network.getInstance().vis.selectAll(".node")
            .filter(function(df, i) { return d.node == df.id; })
            .attr("cy") - 10 ;
      });
    return this;
  };

  // Factions --
  this.updateFactions = function(data) {
    var factions = this.setFactions(data);

    var factions_enter = factions.enter()
      .append("g")
        .attr("class", "faction")
        .attr("transform", function(d, i) { return "translate(20,"+ (Network.getInstance().height - i * 30 - 50) +")"; });

    factions_enter.append("rect")
      .attr("width", 100)
      .attr("height", 25)
      .attr("fill", function(d) { return d.id == 0 ? "#E74C3C" : Network.getInstance().color(d.group); });

    factions_enter.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text(function(d) { return d.name; });
    return this;
  };

  // Getters & setters --
  this.getFactions  = function() { return this.svg.selectAll(".faction").data(); };
  this.getGhosts    = function() { return this.vis.selectAll(".ghost").data(); };
  this.getLinks     = function() { return this.vis.selectAll(".link").data(); };
  this.getNodes     = function() { return this.vis.selectAll(".node").data(); };

  this.setFactions  = function(data) { return this.svg.selectAll(".faction").data(data); };
  this.setGhosts    = function(data) { return this.vis.selectAll(".ghost").data(data); };
  this.setLinks     = function(data) { return this.vis.selectAll(".link").data(data); };
  this.setNodes     = function(data) { return this.vis.selectAll(".node").data(data); };
};

Network.getInstance = function () { return Network._instance || new Network(); }
console.log('Network graph: ready');

