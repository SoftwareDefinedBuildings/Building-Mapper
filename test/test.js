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
});
