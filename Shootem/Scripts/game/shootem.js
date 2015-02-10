
//
// game controller
//
function GameController(canvasWidth, canvasHeight, signalR) {
    var that = this;
    var _canvasWidth = canvasWidth;
    var _canvasHeight = canvasHeight;
    var _signalR = signalR;
    var _canvas = document.querySelector("#gameBoard");
    var _context = _canvas.getContext("2d");
    var _lastTime = 0;
    var _totalTime = 0;
    var _model, _view;

    function startGame() {
        $(".game-screen").show();
        that.update();
    }

    //
    // Init the game
    // 
    this.init = function (canvasWidth, canvasHeight) {
        _canvas.height = canvasHeight;
        _canvas.width = canvasWidth;

        loader.init();
        keyboard.init();
        mouse.init();

        //
        // load all the images
        //
        that.loadContent();

        //
        // When images is loaded
        //
        if (loader.loaded) {
            startGame();
        }
        else {
            loader.onload = startGame;
        }
    };

    //
    // update game 
    //
    this.update = function () {
        //
        // get gametime
        //
        var gameTime = _lastTime !== 0 ? (Date.now() - _lastTime) / 1000 : 0;
        _totalTime += gameTime;

        //
        // player want to attack
        //
        if (_view.playerWantsToAttack())
            _model.playerAttack(keyboard.keyPressed);

        //
        // player wants to move
        //
        if (_view.playerWantsToMove())
            _model.playerMove(mouse.clickX, mouse.clickY, _canvasWidth, _canvasHeight, _view.getDiff());

        //
        // check scroll view
        //
        _view.checkScrollScreen(gameTime);
        //
        // update the game model
        //
        _model.update(gameTime, _signalR);

        //
        // write out the gamemodel 
        //
        _view.draw(_context, _canvas, _model);
        
        //
        // set last time
        //
        _lastTime = Date.now();

        //
        // repeat
        //
        requestAnimationFrame(that.update, _canvas);
    };

    this.loadContent = function () {

        //
        // load all the images
        //

        //
        // set view and gamecamera
        //
        var sprites = { "player": { "type": "character", "sprite": loader.loadImage("content/images/player/guy.png")  }};
        _model = new GameModel();
        _view = new GameView(sprites, _model, _canvasWidth, _canvasHeight);


    };

    that.init(_canvasWidth, _canvasHeight);
}



//
// Model of game, rules and such
//
function GameModel() {
    var _playerModel = new PlayerModel(playerClass.INFANTRY);
    var _level = new Level();

    //
    // update method
    //
    this.update = function (gameTime, signalR) {
        _playerModel.update(gameTime);
    };

    this.getLevel = function () {
        return _level;
    };

    //
    // Get player model
    //
    this.getPlayerModel = function () {
        return _playerModel;
    };

    //
    // Move player
    //
    this.playerMove = function (x, y, canvasWidth, canvasHeight, diff) {
        x = x / canvasWidth * _level.width() + diff.diffX;
        y = y / canvasHeight * _level.height() + diff.diffY;
        _playerModel.move(x, y);
    };

    this.playerAttack = function (keyPressed) {
        _playerModel.attack(keyPressed);
    };
}

//
// gameview, drawing and inputs
//
function GameView(spriteBatch, gameModel, canvasWidth, canvasHeight) {
    var _gameModel = gameModel;
    var _spriteBatch = spriteBatch; 
    var _canvasWidth = canvasWidth;
    var _canvasHeight = canvasHeight;
    var hoverBorderX = _canvasWidth / _gameModel.getLevel().width();
    var hoverBorderY = _canvasHeight / _gameModel.getLevel().height();
    var _scrollSpeed = 4; // 4 tiles per sec

    var _camera = new GameCamera(canvasWidth, canvasHeight, _gameModel.getLevel().width(), _gameModel.getLevel().height());
    var _playerView = new PlayerView(spriteBatch.player);

    this.draw = function (context, canvas, gameModel) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        _playerView.draw(context, gameModel.getPlayerModel(), _camera);
    };

    this.checkScrollScreen = function (gameTime) {
        var diff = _scrollSpeed * gameTime;

        //
        // left
        //
        if (mouse.x < hoverBorderX && mouse.x > 0 && _camera.getDiff().diffX > 0)
            _camera.setDiff(-diff, 0);
        

        //
        // right
        //
        if (mouse.x > (_canvasWidth - hoverBorderX) && _camera.getDiff().diffX < 32)
            _camera.setDiff(diff, 0);
        
        //
        // up
        //
        if (mouse.y < hoverBorderY && mouse.y > 0 && _camera.getDiff().diffY > 0)
            _camera.setDiff(0, -diff);
        
        //
        // down
        //
        if (mouse.y > (_canvasHeight - hoverBorderY) && _camera.getDiff().diffY < 18)
            _camera.setDiff(0, diff);
        
    };

    this.playerWantsToAttack = function () {
        return keyboard.pressing && (keyboard.keyPressed === "q" || keyboard.keyPressed === "w" || keyboard.keyPressed === "e" || keyboard.keyPressed === "r");
    };

    this.getDiff = function () {
        return _camera.getDiff();
    };

    this.playerWantsToMove = function () {
        return mouse.rightClicked;
    };
}
    


//
// game camera "class"
// scale the canvas down to tiles
// get the visual position (px cord)
// get the model position (tiles) 
//
function GameCamera(canvasWidth, canvasHeight, maxLogicalCoordinateX, maxLogicalCoordinateY) {
    var _scaleX = canvasWidth / maxLogicalCoordinateX;
    var _scaleY = canvasHeight / maxLogicalCoordinateY;

    var _diffX = 0;
    var _diffY = 0;

    this.getVisualPositions = function (x, y) {
        x = x - _diffX;
        y = y - _diffY;
        console.log(_diffX);
        return { X: (x * (_scaleX)), Y: (y * (_scaleY)) };
        
    };

    this.getVisualPositionsWithDiff = function (x, y) {
        return { X: (x * (_scaleX + _diffX)), Y: (y * (_scaleY + _diffY)) };
    };

    this.getModelPositions = function (x, y) {
        return { X: (x / _scaleX), Y: ((y / _scaleY)) };
    };

    this.getModelPositionsWithDiff = function (x, y) {
        return { X: (x / _scaleX) + _diffX, Y: ((y / _scaleY) + _diffY) };
    };

    this.getVisualRectangle = function (x, y, logicalWidthRadius, logicalHeightRadius) {
        var visualWidth = (logicalWidthRadius * _scaleX) * 2;
        var visualHeight = (logicalHeightRadius * _scaleY) * 2;

        var visualPosition = this.getVisualPositions(x, y);
        return { x: visualPosition.X, y: visualPosition.Y, width: visualWidth, height: visualHeight };
    };

    this.getDiff = function () {
        return { diffX: _diffX, diffY: _diffY };
    };

    //
    // set diff with model coordinates
    //
    this.setDiff = function (modelXDiff, modelYDiff) {
        _diffX += modelXDiff;
        _diffY += modelYDiff;
    };

}


//
// gamelevel, saves all the data about the game, is it pause, max logical width and height, and so on
//
function Level() {

    var _width = 16;
    var _height = 9;

    this.width = function () {
        return _width;
    };
    this.height = function () {
        return _height;
    };
}

//
// fps
//
var fps = {
    startTime: 0,
    frameNumber: 0,
    getFPS: function () {
        this.frameNumber++;
        var d = new Date().getTime(),
			currentTime = (d - this.startTime) / 1000,
			result = Math.floor((this.frameNumber / currentTime));

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        $(".game-settings .fps").remove();
        $(".game-settings").append('<li class="fps">' + result + ' fps</div>');

    }
};

var keyboard = {
    keyArray: [],
    init: function () {
        document.addEventListener("keyup", function (event) {

            var keyIndex = keyboard.keyArray.lastIndexOf(String.fromCharCode(event.which).toLowerCase());

            if (keyIndex > -1) {
                keyboard.keyArray.splice(keyIndex, 1);
            }

            keyboard.keyArray.forEach(function (entity, index) {
                if (entity !== keyboard.keyPressed) {
                    keyboard.prevKeyPressed = keyboard.keyPressed;
                    keyboard.keyPressed = entity;
                }
            });

            keyboard.prevKeyPressed = keyboard.keyPressed;

            if (keyboard.keyArray.length === 0) {
                keyboard.keyPressed = null;
                keyboard.pressing = false;
            }


        });
        document.addEventListener("keydown", function (event) {

            if (String.fromCharCode(event.which).toLowerCase() !== keyboard.keyPressed) {
                keyboard.keyArray.push(String.fromCharCode(event.which).toLowerCase());
            }

            keyboard.prevKeyPressed = keyboard.KeyPressed;
            keyboard.keyPressed = String.fromCharCode(event.which).toLowerCase();
            keyboard.pressing = true;
        });
    }
};

var mouse = {
    x: 0,
    y: 0,
    clickX: 0,
    clickY: 0,
    rightClicked: false,
    init: function () {
        var timeout;
        

        $(document).on("contextmenu", function (event) {
            clearInterval(timeout);
            mouse.resetClick();

            mouse.clickX = event.pageX;
            mouse.clickY = event.pageY;

            if (typeof mouse.clickX === "undefined" && typeof mouse.clickY === "undefined") {
                mouse.clickX = event.originalEvent.touches[0].pageX;
                mouse.clickY = event.originalEvent.touches[0].pageY;
            }

            mouse.rightClicked = true;

            timeout = setTimeout(function () {
                clearInterval(timeout);
                mouse.resetClick();
            }, 20);

            return false;
        });
        $(document).on("mousemove", function (event) {
            mouse.x = event.pageX;
            mouse.y = event.pageY;

            if (typeof mouse.x === "undefined" && typeof mouse.y === "undefined") {
                mouse.x = event.originalEvent.touches[0].pageX;
                mouse.y = event.originalEvent.touches[0].pageY;
            }

        });
        $(window).on("mouseout", function (e) {
            mouse.x = -1;
            mouse.y = -1;
        });

    },
    resetClick: function () {

        mouse.clickX = 0;
        mouse.clickY = 0;
        mouse.rightClicked = false;
    }
};

var playerClass = {
    SUPPORT: 0,
    INFANTRY: 1,
    TACTICAL: 2
};
