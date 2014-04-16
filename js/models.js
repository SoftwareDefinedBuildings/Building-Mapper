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
