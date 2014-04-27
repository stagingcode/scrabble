/**
 * Board constructor
 *
 * @constructor
 */
function Board(game) {
  this.tiles = [];

  this.game = game;
  this.paperObject = null;

  this.width = 600;
  this.height = 600;

  this.tileSize = new paper.Size(40, 40);

  this.tileCount = 15;

  this.textTiles = [];

  this.selectedTiles = [];
}

/**
 * Gets board tile using it's x and y indexes
 *
 * @param xIndex
 * @param yIndex
 * @returns {*}
 */
Board.prototype.getTileByIndex = function(xIndex, yIndex) {
  for(var t in this.tiles) {
    var tile = this.tiles[t];
    if(tile.xIndex == xIndex && tile.yIndex == yIndex) {
      return tile;
    }
  }

  return false;
};

/**
 * Selects given tile
 *
 * @param tile
 */
Board.prototype.selectTile = function(tile) {
  this.selectedTiles.push(tile);

  tile.children[1].fillColor = 'green';
};

/**
 * Unselects all tile previously selected
 */
Board.prototype.unselectTiles = function() {
  var word = '';

  for(var tile in this.selectedTiles) {
    if(this.selectedTiles.hasOwnProperty(tile)) {
      word += this.selectedTiles[tile].data.tile.char;
      this.selectedTiles[tile].children[1].fillColor = 'white';
    }
  }

  if(this.checkDictionary(word)) {
    // word exists remove tiles
    for(var tile in this.selectedTiles) {
      if(this.selectedTiles.hasOwnProperty(tile)) {
        var boardTile = this.selectedTiles[tile].data.tile.boardTile;
        this.selectedTiles[tile].remove();
        boardTile.textTile = null;
        this.addTextTile(boardTile, boardTile.paperObject.position);
      }
    }
  }

  this.selectedTiles = [];
};

/**
 * Moves the tiles where needed
 */
Board.prototype.moveTiles = function() {

};

/**
 * Check for a word in dictionary
 *
 * @param word
 * @returns {boolean}
 */
Board.prototype.checkDictionary = function(word) {
  return (dictionary.indexOf(word) !== -1);
};

/**
 * Checks if given tile has adjacent textTiles placed
 * Allows center placement without adjacent tiles
 *
 * @param tile
 * @param direction
 */
Board.prototype.checkAdjacent = function(tile, direction) {
  if(!direction) {
    direction = null;
  }
  var boardTile = (tile.onTile || tile);

  /* allow center placement */
  if(boardTile.xIndex == (this.tileCount-1)/2
    && boardTile.yIndex == (this.tileCount-1)/2
    && !direction) {
    return boardTile;
  }

  var yIndex = boardTile.yIndex;
  var xIndex = boardTile.xIndex;

  /* checks for down */
  if(this.getTileByIndex(xIndex, yIndex+1)
    && this.getTileByIndex(xIndex, yIndex+1).occupied
    && (!direction || direction == 'down')) {
    return (!direction) ? boardTile : this.getTileByIndex(xIndex, yIndex+1);
  }

  /* checks for upper */
  if(this.getTileByIndex(xIndex, yIndex-1)
    && this.getTileByIndex(xIndex, yIndex-1).occupied
    && (!direction || direction == 'up')) {
    return (!direction) ? boardTile : this.getTileByIndex(xIndex, yIndex-1);
  }

  /* check for left */
  if(this.getTileByIndex(xIndex-1, yIndex)
    && this.getTileByIndex(xIndex-1, yIndex).occupied
    && (!direction || direction == 'left')) {
    return (!direction) ? boardTile : this.getTileByIndex(xIndex-1, yIndex);
  }

  /* check for right */
  if(this.getTileByIndex(xIndex+1, yIndex)
    && this.getTileByIndex(xIndex+1, yIndex).occupied
    && (!direction || direction == 'right')) {
    return (!direction) ? boardTile : this.getTileByIndex(xIndex+1, yIndex);
  }


  return false;
};

/**
 * Function to draw the board
 */
Board.prototype.draw = function() {
  var self = this;
  var board = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(this.width, this.height));
  board.fillColor = '#f2f2f2';

  this.paperObject = board;

  this.generateTiles();
};

/**
 * Generates textTile for the boardTile
 *
 * @param boardTile
 * @param pos
 * @return *
 */
Board.prototype.addTextTile = function(boardTile, pos) {
  var textTile = new TextTile(this.game);
  // first get char for the textTile
  textTile.chooseChar(this.game.charPool);
  textTile.draw(pos, this.tileSize.subtract(1));
  textTile.boardTile = boardTile;

  boardTile.textTile = textTile;

  return textTile;
};

/**
 * Generates tiles on the board
 * Scrabble board consists of 15x15 tiles
 */
Board.prototype.generateTiles = function() {
  for(var x = 0;x < this.tileCount;x++) {
    for(var y = 0;y < this.tileCount;y++) {

      var xLoc = x * this.tileSize.width;
      var yLoc = y * this.tileSize.height;
      var position = new paper.Point(xLoc, yLoc);

      var tile = new BoardTile(this.game);
      tile.xIndex = x;
      tile.yIndex = y;
      tile.draw(position, this.tileSize);

      this.textTiles.push(this.addTextTile(tile, position.add(20)));
      this.tiles.push(tile);
    }
  }
};