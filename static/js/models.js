var Util = {};

Util.argmin = function(list, func) {
    if (typeof func === 'undefined') {
        func = function (x){return x;};
    }
    var minValue = Infinity,
        minIndex = -1;
    for (var i = 0; i < list.length; i++) {
        if (func(list[i]) < minValue) {
            minIndex = i;
            minValue = func(list[i]);
        }
    }
    return minIndex;
};

Util.argmax = function(list, func) {
    if (typeof func === 'undefined') {
        func = function (x){return x;};
    }
    var maxValue = -Infinity,
        maxIndex = -1;
    for (var i = 0; i < list.length; i++) {
        if (func(list[i]) > maxValue) {
            maxIndex = i;
            maxValue = func(list[i]);
        }
    }
    return maxIndex;
};


var Point = function(x, y) {
    if (typeof x === 'undefined' || typeof y === 'undefined'){
        throw new Error("Need to specify x and y");
    }

    this.x = x;
    this.y = y;
};

Point.getX = function(p) {
    return p.x;
};

Point.getY = function(p) {
    return p.y;
};

Point.prototype.toJSON = function() {
    return {
        x: this.x,
        y: this.y
    };
};

Point.prototype.equals = function(p) {
    return p.x === this.x && p.y === this.y;
};

var Shape = function(points) {
    if (typeof points === 'undefined'){
        this.points = [];
    } else {
        // list of point
        this.points = points;
    }

};

Shape.prototype.toJSON = function() {
    var json_points = [];
    for (var i = 0; i < this.points.length; i++) {
        json_points.push(this.points[i].toJSON());
    }

    return {
        points: json_points
    };
};

Shape.prototype.findPointIdx = function(x, y) {
    var p = new Point(x, y);
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].equals(p)) {
            return i;
        }
    }
    // Point does not exist within collection
    return -1;
};

Shape.prototype.getPoints = function() {
    return this.points;
};

Shape.prototype.getTopLeftPoint = function() {
    var xIdx = Util.argmin(this.points, Point.getX),
        yIdx = Util.argmin(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Shape.prototype.getTopRightPoint = function() {
    var xIdx = Util.argmax(this.points, Point.getX),
        yIdx = Util.argmin(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Shape.prototype.getBottomRightPoint = function() {
    var xIdx = Util.argmax(this.points, Point.getX),
        yIdx = Util.argmax(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Shape.prototype.getBottomLeftPoint = function() {
    var xIdx = Util.argmin(this.points, Point.getX),
        yIdx = Util.argmax(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Shape.prototype.getHeight = function() {
    //TODO: get height of rectangle
};

Shape.prototype.getWidth = function() {
    //TODO: get width of rectangle
};

Shape.prototype.setPoints = function(points) {
    this.points = points;
};

Shape.prototype.setFromTopLeftPoint = function(x, y) {
    this.points = [
        new Point(x, y),
        new Point(x, y),
        new Point(x, y),
        new Point(x, y)
    ];
};

Shape.prototype.updateFromBottomRight = function(x, y) {
    // top left
        // nothing
    // top right
    this.points[1].x = x;
    // bottom left
    this.points[2].y = y;
    // bottom right
    this.points[3].x = x;
    this.points[3].y = y;
};

var Zone = function(shape) {
    this.shape = shape;
    this.label = '';
    this.extras = {};
};

Zone.prototype.setLabel = function(label) {
    this.label = label;
};

Zone.prototype.getLabel = function() {
    return this.label;
};

Zone.prototype.setExtras = function(attributes) {
    //TODO: test for attribute membership
};

Zone.prototype.toJSON = function () {
    return {
        shape: this.shape.toJSON()
    };
};

var Floor = function(input_zones) {
    if (typeof input_zones === 'undefined') {
        this.zones = [];
    } else {
        this.zones = input_zones;
    }
};

Floor.prototype.toJSON = function() {
    var json_zones = [];
    for (var i = 0; i < this.zones.length; i++) {
        json_points.push(this.zones[i].toJSON());
    }
    return {
        zones: json_zones
    };
};


if (typeof module === 'undefined') {
    var module = {};
}
module.exports = {
    Point: Point,
    Shape: Shape,
    Floor: Floor,
    Util: Util
};


/*
 
How points should be used:
class Point
    - should have x,y
    - 2 edges
    - other possible metadata

class Edge
    - should have start/end Point


How points should look be stored with respect to everything:

var floors = [
    {
        floorNumber: 4
        descriptiveFloorNumber: "4",
        rooms: [
            { 
                extras: {
                    'owner': 'David Culler'
                },
                label: '465',
                // must be in order (clockwise)
                points: [
                    {
                        x: 130,
                        y: 200
                    },
                    {
                        x: 230,
                        y: 200
                    },
                    {
                        x: 230,
                        y: 100
                    }
                ]
            }
        ]
    },
    {
        floorNumber: 1
        descriptiveFloorNumber: "Basement",
        rooms: [
            { 
                extras: {
                    'owner': 'server room'
                },
                label: '123',
                points: [
                    {
                        x: 130,
                        y: 200
                    },
                    {
                        x: 230,
                        y: 200
                    },
                    {
                        x: 230,
                        y: 100
                    }
                ]
            }
        ]
    }
]
*/
