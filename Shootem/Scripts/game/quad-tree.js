function Rectangle(x, y, width, height) {
    var _x = x;
    var _y = y;
    var _width = width;
    var _height = height;

    this.getX = function () {
        return _x;
    };

    this.getY = function () {
        return _y;
    };

    this.getWidth = function () {
        return _width;
    };

    this.getHeight = function () {
        return _height;
    };
}

function QuadTree(level, bounds) {
    this.MAX_LEVEL = 5;
    this.MAX_OBJECTS = 10;

    this._level = level;
    this.objects = [];
    this.nodes = [];
    this._bounds = bounds;    
}

QuadTree.prototype.clear = function () {
    this.objects = [];
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i] != null) {
            this.nodes[i] = [];
            this.nodes[i] = null;
        }
    }
};

QuadTree.prototype.split = function () {
    var subWidth = parseInt(bounds.getWidth() / 2);
    var subHeight = parseInt(bounds.getHeight() / 2);
    var x = parseInt(bounds.getX());
    var y = parseInt(bounds.getY());
 
    this.nodes[0] = new Quadtree(level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
    this.nodes[1] = new Quadtree(level+1, new Rectangle(x, y, subWidth, subHeight));
    this.nodes[2] = new Quadtree(level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
    nodes[3] = new Quadtree(level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
};

/*
 * Determine which node the object belongs to. -1 means
 * object cannot completely fit within a child node and is part
 * of the parent node
 */
QuadTree.prototype.getIndex = function (rect) {
    var index = -1;
    var verticalMidpoint = bounds.getX() + (bounds.getWidth() / 2);
    var horizontalMidpoint = bounds.getY() + (bounds.getHeight() / 2);

    // Object can completely fit within the top quadrants
    var topQuadrant = (rect.getY() < horizontalMidpoint && rect.getY() + rect.getHeight() < horizontalMidpoint);
    // Object can completely fit within the bottom quadrants
    var bottomQuadrant = (rect.getY() > horizontalMidpoint);

    // Object can completely fit within the left quadrants
    if (rect.getX() < verticalMidpoint && rect.getX() + rect.getWidth() < verticalMidpoint) {
        if (topQuadrant) {
            index = 1;
        }
        else if (bottomQuadrant) {
            index = 2;
        }
    }
    // Object can completely fit within the right quadrants
    else if (rect.getX() > verticalMidpoint) {
        if (topQuadrant) {
            index = 0;
        }
        else if (bottomQuadrant) {
            index = 3;
        }
    }

    return index;
};

/*
 * Insert the object into the quadtree. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding nodes.
 */
QuadTree.prototype.insert = function (rect) {
    if (this.nodes[0] != null) {
        var index = getIndex(rect);

        if (index != -1) {
            this.nodes[index].insert(rect);

            return;
        }
    }

    this.objects.push(rect);

    if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
        if (this.nodes[0] == null) {
            this.split();
        }

        var i = 0;
        while (i < this.objects.length) {
            var index = getIndex(this.objects[i]);
            if (index != -1) {
                this.nodes[index].insert(this.objects.splice(i, 1));
            }
            else {
                i++;
            }
        }
    }
}

/*
 * Return all objects that could collide with the given object
 */
QuadTree.prototype.retrieve = function(returnObjects, rect) {
   var index = this.getIndex(rect);
if (index != -1 && nodes[0] != null) {
    nodes[index].retrieve(returnObjects, pRect);
}
 
returnObjects = returnObjects.concat(this.objects);
 
return returnObjects;
}
