/**
 * Board constructor
 * @constructor
 */
function Board() {
  this.tiles = [];

  this.paperObject = null;

  this.width = 600;
  this.height = 600;

  this.tileSize = 40;

  this.tileCount = 15;

  this.wordTiles = [];
}

/**
 * Gets board tile using it's x and y indexes
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
 * Check for a word in dictionary
 * @param word
 * @returns {boolean}
 */
Board.prototype.checkDictionary = function(word) {
  return (dictionary.indexOf(word) !== -1);
};

/**
 * Marks tiles valid so they won't be removed
 */
Board.prototype.markTilesValid = function(tiles) {
  for(var t in tiles) {
    tiles[t].valid =  true;
  }
};

/**
 * Validates board
 * @param game
 */
Board.prototype.validateBoard = function(game) {

  for(var t in this.tiles) {
    var tile = this.tiles[t];

    // words that go down
    if(this.getTileByIndex(tile.xIndex, tile.yIndex+1).textTile
      && !this.getTileByIndex(tile.xIndex, tile.yIndex-1).textTile) {
      var wordDown = this.getWord(tile, '', 'down');
      if(wordDown != '' && dictionary.indexOf(wordDown) !== -1) {
        // CORRECT WORD
        this.markTilesValid(this.wordTiles);
        this.wordTiles = [];
      }
    }

    // words that go right
    if(this.getTileByIndex(tile.xIndex+1, tile.yIndex).textTile
      && !this.getTileByIndex(tile.xIndex-1, tile.yIndex).textTile) {
      var wordRight = this.getWord(tile, '', 'right');
      if(wordRight != '' && dictionary.indexOf(wordRight) !== -1) {
        // CORRECT WORD
        this.markTilesValid(this.wordTiles);
        this.wordTiles = [];
      }
    }

    if(tile.textTile && (!tile.valid || !this.checkAdjacent(tile))) {
      tile.textTile.paperObject.position = tile.textTile.offBoardPosition;
      tile.textTile = null;
      tile.occupied = false;
    }

    if(tile.textTile && tile.valid && !tile.processed) {
      tile.textTile.draggable = false;
      tile.textTile.paperObject.children[1].fillColor = 'green';

      // pull new tile for the user
      var newTextTile = new TextTile();
      newTextTile.chooseChar(game.charPool);
      newTextTile.draw(tile.textTile.offBoardPosition, new paper.Size(38, 38));

      game.userTiles.push(newTextTile);

      tile.processed = true;
    }
  }
};

/**
 * Gets word starting from given tile in given direction
 * @param tile
 * @param word
 */
Board.prototype.getWord = function(tile, word, direction) {

  if(!tile.textTile) {
    return word;
  } else {
    this.wordTiles.push(tile);
    word += tile.textTile.char;
    return this.getWord(this.checkAdjacent(tile, direction), word, direction);
  }
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
 * @param game
 */
Board.prototype.draw = function(game) {
  var self = this;
  var board = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(this.width, this.height));
  board.fillColor = '#f2f2f2';

  this.paperObject = board;

  /* draw validating button */
  var validationBtn = new paper.Path.Rectangle(new paper.Point(this.width, this.height), new paper.Size(40, 40));
  validationBtn.fillColor = 'green';

  validationBtn.onMouseDown = function(event) {
    self.validateBoard(game);
  };

  this.generateTiles();
};

/**
 * Generates tiles on the board
 * Scrabble board consists of 15x15 tiles
 */
Board.prototype.generateTiles = function() {

  for(var x = 0;x < this.tileCount;x++) {
    for(var y = 0;y < this.tileCount;y++) {

      var xLoc = x * this.tileSize;
      var yLoc = y * this.tileSize;

      var tile = new BoardTile();
      tile.xIndex = x;
      tile.yIndex = y;
      tile.draw(new paper.Point(xLoc, yLoc), new paper.Size(this.tileSize, this.tileSize));
      this.tiles.push(tile);
    }
  }
};