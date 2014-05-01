var ViewPage = function(floorId, imageHolder) {
    this.children = {};
    this.children.imageHolder = imageHolder;

    this.zones = null;

    this.floorId = floorId;
    this.fetchFloor();
};

ViewPage.prototype.fetchData = function() {
};

ViewPage.prototype.fetchFloor = function() {
    $.ajax({
        url: '/fetch/floor/' + this.floorId,
        type: 'GET',
        success: this.renderFloor.bind(this)
    });
};

ViewPage.prototype.renderFloor = function(response) {
    var that = this;
    var image;
    if (response.success) {
        this.zones = Zone.fromJSONList(response.floor.zones);
        image = new Image();
        image.onload = function() {
            var svg = d3.select(that.children.imageHolder[0]).append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height)
                        .style('background-image', 'url(/uploads/' + response.floor.imgname + ')');

            // hack for Safari and Chrome to get onclick event
            svg.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .style('fill', 'transparent')
                .attr('width', this.width)
                .attr('height', this.height);
            // needed hack to re-render the drop space
            that.children.imageHolder.css('background', '#fff');

            // setup the svg for drawing
            that.drawCanvas(svg);
        };

        image.src = '/uploads/' + response.floor.imgname;
    }
};

ViewPage.prototype.drawCanvas = function(svg) {
    // you're going to need this to reference "this" in the event callback functions
    var that = this;

    // want to refernece that.zones in your callbacks
    // svg is the d3 svg object, it is available to all functions defined within this scope

    var zone = svg.selectAll(".rectZone").data(that.zones);

    zone.enter()
        .append("rect")
        .attr("class", "rectZone")
        .attr("x", function(d) {
                return d.shape.getTopLeftPoint().x;
                })
        .attr("y", function(d) {
                return d.shape.getTopLeftPoint().y;
                })
        .attr("height", function(d) {
                return 0;
                })
        .attr("width", function(d) {
                return 0;
                })
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("fill", "#0f57a0")
        .attr("opacity", "0.8");

    zone.transition()
        .duration(10)
        .attr("x", function(d) {
                return d.shape.getTopLeftPoint().x;
                })
        .attr("y", function(d) {
                return d.shape.getTopLeftPoint().y;
                })
        .attr("height", function(d) {
            return Math.abs(d.shape.getTopLeftPoint().y - d.shape.getBottomRightPoint().y);
                })
        .attr("width", function(d) {
                return Math.abs(d.shape.getTopLeftPoint().x - d.shape.getBottomRightPoint().x);
                });
            
    zone.exit().remove();
};
