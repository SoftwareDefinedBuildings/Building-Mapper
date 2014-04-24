var Point = function(x, y) {
    if (typeof x === 'undefined' || typeof y === 'undefined'){
        throw new Error("Need to specify x and y");
    }

    this.x = x;
    this.y = y;
};

Point.prototype.toJSON = function() {
    return {
        x: this.x,
        y: this.y
    };
};

var Zone = function(points) {
    if (typeof points === 'undefined'){
        throw new Error("Need to have at least one point.");
    }

    // list of point
    this.points = points;
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

Zone.prototype.getPoints = function() {
    return this.points;
};

Zone.prototype.setPoints = function(points) {
    this.points = points;
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

module.exports = {
    Point: Point,
    Zone: Zone,
    Floor: Floor
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
