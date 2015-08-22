/**
 * Created by Fanaen on 22/08/2015.
 */

var Network = function () {
  if (Network._instance) { return Network._instance; }
  Network._instance = this;

  // -- Attributes --
  this.width = 960;
  this.height = 500;

  this.svg = {};
  this.color = {};
  this.force = {};

  // -- Methods --
  this.init = function() {

    // Init the frame --
    this.svg = d3.select("body").append("svg");
    this.updateSize();

    this.color = d3.scale.category20();

    // Force system --
    this.force = d3.layout.force()
      .charge(-500)
      .linkDistance(100)
      .size([this.width, this.height]);

  };

  this.updateSize = function() {

    var width = $(window).width() - 40,
      height = $(window).height() - 40;

    this.svg
      .attr("width", width)
      .attr("height", height);
  };

  this.loadData = function() {
    d3.json("data/graph-dummy.json", function(error, graph) {
      if (error) throw error;

      Network.getInstance().updateData(graph);
    });
  };

  this.updateData = function(graph) {

    this.force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    var link = this.svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = this.svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .style("fill", function(d) { return Network.getInstance().color(d.group); })
      .call(this.force.drag);

    node.append("title")
      .text(function(d) { return d.name; });

    this.force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });
  };
};

Network.getInstance = function () { return Network._instance || new Network(); }
console.log('Network graph: ready');

