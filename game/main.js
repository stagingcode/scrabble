/**
 * Game constructor
 * @param canvas
 * @constructor
*/
function Scrabble(canvas) {
  this.canvas = canvas;

  // game char pool, still missing empty ones
  this.charPool = 'aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz'.split('');
  this.userTiles = [];
  this.userTilesY = 700;

  this.board = new Board();
  this.board.draw(this);

  this.drawTextTiles();

  this.assingHandlers();
}

/**
 * Draw initial text tiles (7)
 */
Scrabble.prototype.drawTextTiles = function() {
  for(var tileCount = 0;tileCount < 7;tileCount++) {
    var textTile = new TextTile();
    // first get char for the textTile
    textTile.chooseChar(this.charPool);
    textTile.draw(new paper.Point(100 + (tileCount*48)+4, this.userTilesY), new paper.Size(38, 38));

    this.userTiles.push(textTile);
  }
};

/**
 * Assigns handlers to the canvas
 */
Scrabble.prototype.assingHandlers = function() {
  var game = this;
  var tool = new paper.Tool();


  var currentTile = null;
  tool.onMouseDown = function(event) {
    currentTile = null;
    for(var t in game.userTiles) {
      var tile = game.userTiles[t];

      /* if mouse is on the tile, "pick" it up */
      if(tile.paperObject.bounds.intersects(event.point)) {
        currentTile = tile;
        break;
      }
    }

    /* if tile is selected and it's draggable, mark it dragging */
    if(currentTile && currentTile.draggable) {
      currentTile.dragging = true;
      currentTile.paperObject.bringToFront();
      currentTile.originalPosition = currentTile.paperObject.position;

      if(currentTile.onTile) {
        currentTile.onTile.occupied = false;
        currentTile.onTile.textTile = null;
      }
    } else {
      currentTile = null;
    }
  };

  tool.onMouseMove = function(event) {
    if(currentTile && currentTile.dragging) {
      currentTile.paperObject.position = event.point;

      for(var t in game.board.tiles) {
        var tile = game.board.tiles[t];
        if(tile.paperObject.bounds.contains(event.point)) {
          currentTile.onTile = tile;
          return;
        }
      }

      currentTile.onTile = null;
    }
  };

  tool.onMouseUp = function(event) {
    if(currentTile && currentTile.dragging) {
      if(currentTile.onTile && !currentTile.onTile.occupied) {

        // check if we have adjacent tile
        if(game.board.checkAdjacent(currentTile)) {
          currentTile.dragging = false;
          currentTile.paperObject.position = currentTile.onTile.paperObject.position;
          currentTile.onTile.occupied = true;
          currentTile.onTile.textTile = currentTile;
          return;
        }
       }

      currentTile.paperObject.position = currentTile.originalPosition;
      currentTile.dragging = false;
      if(currentTile.onTile) {
        currentTile.onTile = null;
      } else {
        currentTile.paperObject.position = currentTile.offBoardPosition;
      }

    }

  };
};



document.addEventListener('DOMContentLoaded', function(){
  /* get canvas */
  var canvas = document.getElementById('scrabble');

  /* initialize paper */
  paper.setup(canvas);

  /* initialize Scrabble */
  var game = new Scrabble(canvas);

  /* draw canvas */
  paper.view.draw();
});