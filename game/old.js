var canvas = document.getElementById('canvas');
paper.setup(canvas);


var board = new Path.Rectangle(new Point(0, 0), new Size(300, 300));
board.fillColor = '#f2f2f2';

board.tiles = [];
board.textTiles = [];


for(var x = 0;x < 300;x += 50) {
    for(var y = 0;y < 300;y += 50) {
        var tile = new Path.Rectangle(new Point(x, y), new Size(50, 50));
        var tileFiller = new Path.Rectangle(new Point(x+1, y+1), new Size(48, 48));
        tileFiller.fillColor = '#f2f2f2';
        tile.fillColor = '#333';

        board.tiles.push(tile);
    }
}

var movingTile = null;
function onMouseDown(event) {
    movingTile = null;
    for(var t in board.textTiles) {
        if(board.textTiles[t].bounds.intersects(event.point)) {
            movingTile = board.textTiles[t];
            break;
        }
    }

    if(movingTile && movingTile.data.draggable)  {
        movingTile.data.dragging = true;
        movingTile.data.originalPosition = movingTile.position;

        if(movingTile.data.onTile) {
            movingTile.data.onTile.occupied = false;
        }
    } else {
        movingTile = null;
    }

    console.log(movingTile);
}

function onMouseMove(event) {
    if(movingTile && movingTile.data.dragging) {
        movingTile.position = event.point;

        var hitOptions = {
            bounds: true,
            stroke: true,
            fill: true,
            tolerance: 5
        };

        for(var t in board.tiles) {
            if(board.tiles[t].bounds.contains(event.point)) {
                movingTile.data.onTile = board.tiles[t];
                break;
            }
        }

    }
}

function checkForWords() {
    var word = 'AE';
    var userWord = '';
    var groups = [];
    for(var tile in board.tiles) {
        if(board.tiles[tile].data.char) {
            userWord += board.tiles[tile].data.char;
            groups.push(board.tiles[tile].data.group);
        }

    }


    if(userWord == word) {
        for(var group in groups) {
            console.log(groups[group]);
            groups[group].children[1].fillColor = '#009900'
        }
    }
}

function onMouseUp(event) {
    if(movingTile && movingTile.data.dragging) {
        if(movingTile.data.onTile && !movingTile.data.onTile.occupied) {
            movingTile.data.dragging = false;
            movingTile.position = movingTile.data.onTile.position;
            movingTile.data.onTile.occupied = true;
            movingTile.data.onTile.data.char = movingTile.data.char;
            movingTile.data.onTile.data.group = movingTile;
            checkForWords();
            return;
        }
        movingTile.data.dragging = false;

        if(movingTile.data.onTile) {
            movingTile.data.onTile.char = null;
            movingTile.data.onTile.group = null;
            movingTile.data.onTile = null;
        }

        movingTile.position = movingTile.data.originalPosition;
    }

    checkForWords();
}

function randomChar() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTVWYXZ';
    return chars[Math.floor(Math.random(chars.length) * chars.length)];
}

// text  tiles
for(var tileCount = 0;tileCount < 7;tileCount++) {
    var tile = new Path.Rectangle(new Point((tileCount*48)+4, 450), new Size(48, 48));
    tile.fillColor = '#444444';

    var text = new PointText(new Point(tile.position.x - 8, tile.position.y + 8));
    text.fillColor = 'white';
    text.fontSize = '24px';
    text.content = randomChar();

    var textTile = new Group(tile, text);
    textTile.data.draggable = true;
    textTile.data.char = text.content;

    board.textTiles.push(textTile);
}

// Draw the view now:
paper.view.draw();