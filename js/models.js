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

var Zone = function(points) {
    if (typeof points === 'undefined'){
        this.points = [];
    } else {
        // list of point
        this.points = points;
    }

};

Zone.prototype.toJSON = function() {
    var json_points = [];
    for (var i = 0; i < this.points.length; i++) {
        json_points.push(this.points[i].toJSON());
    }

    return {
        points: json_points
    };
};

Zone.prototype.findPointIdx = function(x, y) {
    var p = new Point(x, y);
    for (var i = 0; i < this.points.length; i++) {
        if (this.points[i].equals(p)) {
            return i;
        }
    }
    // Point does not exist within collection
    return -1;
};

Zone.prototype.getPoints = function() {
    return this.points;
};

Zone.prototype.getTopLeftPoint = function() {
    var xIdx = Util.argmin(this.points, Point.getX),
        yIdx = Util.argmin(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Zone.prototype.getTopRightPoint = function() {
    var xIdx = Util.argmax(this.points, Point.getX),
        yIdx = Util.argmin(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Zone.prototype.getBottomRightPoint = function() {
    var xIdx = Util.argmax(this.points, Point.getX),
        yIdx = Util.argmax(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Zone.prototype.getBottomLeftPoint = function() {
    var xIdx = Util.argmin(this.points, Point.getX),
        yIdx = Util.argmax(this.points, Point.getY);
    return this.points[this.findPointIdx(this.points[xIdx].x, this.points[yIdx].y)];
};

Zone.prototype.setPoints = function(points) {
    this.points = points;
};

Zone.prototype.setFromTopLeftPoint = function(x, y) {
    this.points = [
        new Point(x, y),
        new Point(x, y),
        new Point(x, y),
        new Point(x, y)
    ];
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
    Zone: Zone,
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
