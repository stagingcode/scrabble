/**
 * BoardTile constructor
 * @constructor
 */
function BoardTile() {
  this.paperObject = null;

  this.occupied = false;
  this.processed = false;

  this.xIndex = 0;
  this.yIndex = 0;
}

BoardTile.prototype.draw = function(position, size) {
  var tile = new paper.Path.Rectangle(position, size);
  var tileFiller = new paper.Path.Rectangle(position.add(1), size.subtract(2));
  tileFiller.fillColor = '#f2f2f2';
  tile.fillColor = '#333';

  var text = new paper.PointText(position.add(new paper.Point(11, 27)));
  text.fillColor = 'black';
  text.fontSize = '9px';
  text.content = this.xIndex +'.'+ this.yIndex;


  if(this.xIndex == 7 && this.yIndex == 7) {
    tileFiller.fillColor = '#ccc';
  }

  var tileGroup = new paper.Group(tile, tileFiller);
  this.paperObject = tileGroup;
};