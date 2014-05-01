var _URL = window.URL || window.webkitURL;

var acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
};

/**
 * CreatorPage is the UI component object that encapsulates all JavaScript page
 * interactions on the create new floor plan page.
 *
 * @constructor
 * @param {jQuery selector} floorLabel is the input field for the floor label
 * @param {jQuery selector} submitButton is the submission button
 * @param {jQuery selector} imageHolder is the drop zone for the img floorplan
 */
var CreatorPage = function(floorLabel, submitButton, imageHolder) {
    var that = this;

    this.imageFile = null;
    this.zones = [];

    // set child elements
    this.children = {};
    this.children.imageHolder = imageHolder;
    this.children.floorLabel = floorLabel;
    this.children.submitButton = submitButton;
    this.children.canvas = null;

    // set holder callbacks
    this.children.imageHolder.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.children.imageHolder.addClass('hover');
    });

    this.children.imageHolder.on('dragend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.children.imageHolder.removeClass('hover');
    });

    this.children.imageHolder.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.children.imageHolder.removeClass('hover');
        if (that.imageFile === null) {
            // image file not set yet.
            if (e.originalEvent.dataTransfer.files.length === 1) {
                that.setImage(e.originalEvent.dataTransfer.files[0]);
            }
        } else {
            // image file already set. should ask if want to replace
            // note that canvas needs to be replaced as well.
        }
    });

    this.children.submitButton.on('click', function(e) {
        that.publish();
    });
};

CreatorPage.prototype.uploadImage = function(file) {
    $.ajax({
        url: '/up',
        type: 'POST',
        processData: false,
        contentType: 'application/octet-stream',
        beforeSend: function(request) {
            request.setRequestHeader("X-File-Name", file.name);
        },
        data: file,
        success: this.submitData.bind(this)
    });
};

CreatorPage.prototype.submitData = function(response) {
    var data = {
        img: response.imgname,
        zones: this.zones,
        label: this.children.floorLabel.val()
    };
    // send img file name & floor label & zone info
    $.ajax({
        url: '/create',
        type: 'POST',
        processData: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: this.successfulSubmit.bind(this)
    });
};

CreatorPage.prototype.successfulSubmit = function(response) {
    window.location = '/view/' + response.floorId;
    console.log("done!");
};

CreatorPage.prototype.setImage = function(file) {
    this.previewFile(file);
    this.imageFile = file;
    this.children.imageHolder.addClass('solidified');
    // add canvas
};

CreatorPage.prototype.previewFile = function(file) {
    var that = this;
    if (file && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var image = new Image();
            //image.src = event.target.result;
            //image.className = 'floor-img';
            //that.children.imageHolder.html("");
            //that.children.imageHolder.append(image);

            image.onload = function() {
                var svg = d3.select(that.children.imageHolder[0]).append('svg')
                            .attr('width', this.width)
                            .attr('height', this.height)
                            .style('background-image', 'url(' + event.target.result + ')');

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
                that.children.imageHolder.off();
                that.setupCanvas(svg);
            };

            image.src = _URL.createObjectURL(file);
        };

        reader.readAsDataURL(file);
    }  else {
        console.log('Not an acceptable file type!');
        console.log(file);
    }
};

CreatorPage.prototype.setupCanvas = function(svg) {
    // you're going to need this to reference "this" in the event callback functions
    var that = this;

    // want to refernece that.zones in your callbacks
    this.zones = [];

    // svg is the d3 svg object, it is available to all functions defined within this scope

    var currZone;


    function svgMouseDown() {
        var m = d3.mouse(this);
        currZone = new Zone(new Shape());
        currZone.shape.setFromTopLeftPoint(m[0], m[1]);
        that.zones.push(currZone);
        redraw();
        svg.on("mousemove", svgMouseMove);
    }

    function svgMouseMove() {
        var m = d3.mouse(this);
        if (currZone !== null) {
            currZone.shape.updateFromBottomRight(m[0], m[1]);
            redraw();
        }
    }

    function svgMouseUp() {
        var m = d3.mouse(this);
        if (currZone.shape.getHeight() < 5 || currZone.shape.getWidth() < 5) {
            that.zones.pop(that.zones.length -1);
            redraw();
            currZone = null;
        } else {
            currZone = null;
            svg.on("mousemove", null);
        }
    }

    function redraw() {
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
    }

    svg.on("mousedown", svgMouseDown)
        .on("mouseup", svgMouseUp);
};

CreatorPage.prototype.publish = function() {
    var floorLabelText = this.children.floorLabel.val();
    this.disableUI();
    if (floorLabelText.length > 0) {
        if (this.imageFile !== null) {
            // upload the image to server
            this.uploadImage(this.imageFile);
            console.log(floorLabelText);
            console.log(this.imageFile);
        } else {
            alert("Please drop in a floorplan image");
            this.enableUI();
        }
    } else {
        alert("Please enter a floor label");
        this.enableUI();
        this.children.floorLabel.focus();
    }
};

CreatorPage.prototype.flashDropzone = function() {
    //TODO: flash the drop zone
};

CreatorPage.prototype.disableUI = function() {
    this.children.floorLabel.attr('disabled', 'disabled');
    this.children.submitButton.attr('disabled', 'disabled');
};

CreatorPage.prototype.enableUI = function() {
    this.children.floorLabel.removeAttr('disabled');
    this.children.submitButton.removeAttr('disabled');
};
