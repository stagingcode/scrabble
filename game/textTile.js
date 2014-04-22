/**
 * Text tile constructor
 * @constructor
 */
function TextTile(game) {
  this.paperObject = null;
  this.game = null;
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

  this.char = text.content;
  this.paperObject = textTile;
};

/**
 * Chooses a random char from the pool. Removes this char from the pool
 * @param pool
 */
TextTile.prototype.chooseChar = function(pool) {
  var random = Math.floor(Math.random(pool.length) * pool.length);
  this.char = pool[random].toString().toUpperCase();
};