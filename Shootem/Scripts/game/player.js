
function PlayerModel(classType) {
    var _hp = 100;
    var _positionX = 4, _positionY = 0;
    var _classType = classType;
    var _isAttacking, _attackType;
    var _radiusWidth = 0.5;
    var _radiusHeight = 0.5;
    var _movingSpeed = 2.0;
    var _movingPositionX = null;
    var _movingPositionY = null;
    var _lastMovingPositionX = null;
    var _lastMovingPositionY = null;


    var _isMoving = false;

    var _lastDistanceX = null;
    var _lastDistanceY = null;

    this.update = function (gameTime) {

        if (_movingPositionX !== null && _movingPositionY !== null) {
            _isMoving = true;
            var distanceX = _movingPositionX - _positionX;
            var distanceY = _movingPositionY - _positionY;

            if (_lastDistanceX !== null && _lastDistanceY !== null) {
                if (Math.abs(_lastDistanceX) < Math.abs(distanceX) || Math.abs(_lastDistanceY) < Math.abs(distanceY)) {
                    _lastMovingPositionX = _movingPositionX;
                    _lastMovingPositionY = _movingPositionY;
                    _movingPositionX = null;
                    _movingPositionY = null;
                    _lastDistanceX = null;
                    _lastDistanceY = null;
                    _isMoving = false;
                    return
                }

            }

            
           

            var _speedX = _movingSpeed;
            var _speedY = _movingSpeed;

            if (Math.abs(distanceX) > Math.abs(distanceY)) {
                _speedY = Math.abs(distanceY) / Math.abs(distanceX) * _movingSpeed;
            }
            else if (Math.abs(distanceX) < Math.abs(distanceY)) {
                _speedX = Math.abs(distanceX) / Math.abs(distanceY) * _movingSpeed;
            }

            if (_movingPositionX > _positionX)
                _positionX += _speedX * gameTime;
            else if (_movingPositionX < _positionX)
                _positionX -= _speedX * gameTime;

            if (_movingPositionY > _positionY)
                _positionY += _speedY * gameTime;
            else if (_movingPositionY < _positionY)
                _positionY -= _speedY * gameTime;

            _lastDistanceX = distanceX;
            _lastDistanceY= distanceY;
        }

    };

    this.isPlayerMoving = function () {
        return _isMoving;
    };

    this.attack = function (keyPressed) {

    };

    this.move = function (x, y) {
        _lastDistanceX = null;
        _lastDistanceY = null;

        if (x - _radiusWidth !== _lastMovingPositionX)
            _movingPositionX = x - _radiusWidth;
        if(y - _radiusHeight !== _lastMovingPositionY)
            _movingPositionY = y - _radiusHeight;
    };

    this.getLogicalPosition = function() {
        return {x: _positionX, y: _positionY };
    };

    this.getRadiusSize = function () {
        return { width: _radiusWidth, height: _radiusHeight };
    };
}

function PlayerView(spriteBatch) {
    var _spriteBatch = spriteBatch;
    this.draw = function (context, playerModel, camera) {;
        var rectangle; 
        switch (_spriteBatch.type) {
            case "character":
                var playerPosition = playerModel.getLogicalPosition();
                var playerSize = playerModel.getRadiusSize();
                rectangle = camera.getVisualRectangle(playerPosition.x, playerPosition.y, playerSize.width, playerSize.height);
                context.drawImage(_spriteBatch.sprite, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
                break;
        }
    };
}

