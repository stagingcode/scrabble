/**
 * Text tile constructor
 * @constructor
 */
function TextTile() {
  this.paperObject = null;

  this.draggable = true;
  this.dragging = false;
  this.originalPosition = null;
  this.offBoardPosition = null;
  this.onTile = null;
  this.char = null;
  this.points = 0;
}

TextTile.prototype.draw = function(position, size) {
  var tile = new paper.Path.Rectangle(position, size);
  tile.fillColor = '#444444';

  var text = new paper.PointText(position.add(new paper.Point(11, 27)));
  text.fillColor = 'white';
  text.fontSize = '24px';
  text.content = (this.char || '.');

  var textTile = new paper.Group(tile, text);
  textTile.position = position;

  this.draggable = true;
  this.char = text.content;
  this.offBoardPosition = textTile.position;
  this.paperObject = textTile;
};

/**
 * Chooses a random char from the pool. Removes this char from the pool
 * @param pool
 */
TextTile.prototype.chooseChar = function(pool) {
  var random = Math.floor(Math.random(pool.length) * pool.length);
  this.char = pool.splice(random, 1).toString().toUpperCase();
};