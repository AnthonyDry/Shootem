//
// Rectangle of an object
// Contains x and y, width and height of object
//
function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function QuadTree(level, bounds) {
    this.MAX_LEVEL = 5;
    this.MAX_OBJECTS = 10;

    this._level = level;
    this.objects = [];
    this.nodes = [];
    this._bounds = bounds;    
}

//
// Clear the QuadTree
//
QuadTree.prototype.clear = function () {
    var i = 0;
    var l = this.nodes.length;
    this.objects = [];
    for (var i; i < l; i++) {
        if (typeof this.nodes[i] !== 'undefined') {
            this.nodes[i].clear();
            delete this.nodes[i];
        }
    }
};

//
// Split the QuadTree
//
QuadTree.prototype.split = function () {
    var subWidth = Math.round(this.bounds.width / 2);
    var subHeight = Math.round(this.bounds.height / 2);
    
    var x = Math.round(this.bounds.x);
    var y = Math.round(this.bounds.y);

    var nextLevel = this.level + 1;
 
    this.nodes[0] = new Quadtree(nextLevel, new Rectangle(x + subWidth, y, subWidth, subHeight));
    this.nodes[1] = new Quadtree(nextLevel, new Rectangle(x, y, subWidth, subHeight));
    this.nodes[2] = new Quadtree(nextLevel, new Rectangle(x, y + subHeight, subWidth, subHeight));
    this.nodes[3] = new Quadtree(nextLevel, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
};

/*
 * Determine which node the object belongs to. -1 means
 * object cannot completely fit within a child node and is part
 * of the parent node
 */
QuadTree.prototype.getIndex = function (rect) {
    var index = -1;
    var verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
    var horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);

    // Object can completely fit within the top quadrants
    var topQuadrant = (rect.x < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
    // Object can completely fit within the bottom quadrants
    var bottomQuadrant = (rect.y > horizontalMidpoint);

    // Object can completely fit within the left quadrants
    if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
        if (topQuadrant) {
            index = 1;
        }
        else if (bottomQuadrant) {
            index = 2;
        }
    }
    // Object can completely fit within the right quadrants
    else if (rect.x > verticalMidpoint) {
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
    //if we have subnodes ...
    if (typeof this.nodes[0] !== 'undefined') {
        index = this.getIndex(rect);

        if (index !== -1) {
            this.nodes[index].insert(rect);
            return;
        }
    }

    this.objects.push(rect);

    if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
        //split if we don't already have subnodes
        if (typeof this.nodes[0] === 'undefined') {
            this.split();
        }

        var i = 0;
        var index;
        while (i < this.objects.length) {
            index = getIndex(this.objects[i]);
            if (index !== -1) {
                this.nodes[index].insert(this.objects.splice(i, 1)[0]);
            }
            else {
                i++;
            }
        }
    }
};

/*
 * Return all objects that could collide with the given object
 */
QuadTree.prototype.retrieve = function (rect) {
    var index = this.getIndex(rect);
    var returnObjects = this.objects;
    //if we have subnodes ...
    if (typeof this.nodes[0] !== 'undefined') {

        //if pRect fits into a subnode ..
        if (index !== -1) {
            returnObjects = returnObjects.concat(this.nodes[index].retrieve(rect));

            //if pRect does not fit into a subnode, check it against all subnodes
        } else {
            for (var i = 0; i < this.nodes.length; i = i + 1) {
                returnObjects = returnObjects.concat(this.nodes[i].retrieve(rect));
            }
        }
    }

    return returnObjects;
};
