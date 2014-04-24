var assert = require("assert");
var models = require("../js/models");

describe('Point', function(){
  describe('#()', function(){
    it('Should return new object with point x,y', function(){
        var p = new models.Point(2, 1);
        assert.equal(p.x, 2);
        assert.equal(p.y, 1);
    });
  });
  describe('#toJSON()', function(){
    it('Should return JSON object with values', function(){
        var p = new models.Point(2, 1);
        var o = p.toJSON();
        assert.equal(o.x, 2);
        assert.equal(o.y, 1);
    });
  });
  describe('#equals()', function(){
    it('Should return true if points are equal', function(){
        var p1 = new models.Point(2, 1);
        var p2 = new models.Point(2, 1);
        var p3 = new models.Point(1, 1);
        assert.equal(p1.equals(p2), true);
        assert.equal(p1.equals(p3), false);
    });
  });
});


describe('Zone', function(){
  describe('#()', function(){
    it('Should return new object with a list of points', function(){
        var p1 = new models.Point(1, 1);
        var p2 = new models.Point(1, 2);
        var p3 = new models.Point(1, 2);
        var points = [p1, p2, p3];
        var zone = new models.Zone(points);
        assert.equal(zone.points.length, 3);
        assert.equal(zone.points[0], p1);
        assert.equal(zone.points[1], p2);
        assert.equal(zone.points[2], p3);
    });
  });
  describe('#toJSON()', function(){
    it('Should return JSON object with values', function(){
        var p1 = new models.Point(1, 1);
        var p2 = new models.Point(1, 2);
        var p3 = new models.Point(1, 2);
        var points = [p1, p2, p3];
        var zone = new models.Zone(points);
        var o = zone.toJSON();
        assert.equal(o.points.length, 3);
    });
  });
  describe('#getTopLeftPoint()', function(){
    it('Should return JSON object with values', function(){
        var p1 = new models.Point(1, 1);
        var p2 = new models.Point(2, 1);
        var p3 = new models.Point(2, 2);
        var p4 = new models.Point(1, 2);
        var points = [p1, p2, p3, p4];
        var zone = new models.Zone(points);
        assert.equal(zone.getTopLeftPoint(), p1);
    });
  });
  describe('#getBottomRightPoint()', function(){
    it('Should return JSON object with values', function(){
        var p1 = new models.Point(1, 1);
        var p2 = new models.Point(2, 1);
        var p3 = new models.Point(2, 2);
        var p4 = new models.Point(1, 2);
        var points = [p1, p2, p3, p4];
        var zone = new models.Zone(points);
        assert.equal(zone.getBottomRightPoint(), p3);
    });
  });
  describe('#getTopRightPoint()', function(){
    it('Should return JSON object with values', function(){
        var p1 = new models.Point(1, 1);
        var p2 = new models.Point(2, 1);
        var p3 = new models.Point(2, 2);
        var p4 = new models.Point(1, 2);
        var points = [p1, p2, p3, p4];
        var zone = new models.Zone(points);
        assert.equal(zone.getTopRightPoint(), p2);
    });
  });
  describe('#getBottomLeftPoint()', function(){
    it('Should return JSON object with values', function(){
        var p1 = new models.Point(1, 1);
        var p2 = new models.Point(2, 1);
        var p3 = new models.Point(2, 2);
        var p4 = new models.Point(1, 2);
        var points = [p1, p2, p3, p4];
        var zone = new models.Zone(points);
        assert.equal(zone.getBottomLeftPoint(), p4);
    });
  });
});


describe('Util', function(){
  describe('#argmin()', function(){
    it('Should return the min index given a list', function(){
        var m1 = models.Util.argmin([3, 2, 1, 5]);
        assert.equal(m1, 2);

        var m2 = models.Util.argmin(
            [[0, 1], [2, 1], [5, 0]],
            function(x) {return x[0];}
        );
        assert.equal(m2, 0);
    });
  });

  describe('#argmax()', function(){
    it('Should return the min index given a list', function(){
        var m1 = models.Util.argmax([3, 2, 1, 5]);
        assert.equal(m1, 3);

        var m2 = models.Util.argmax(
            [[0, 1], [2, 1], [5, 0]],
            function(x) {return x[0];}
        );
        assert.equal(m2, 2);
    });
  });
});
