(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var index = vendors.length;
    while (index !== 0 && !window.requestAnimationFrame) {
        window.requestAnimationFrame = window[vendors[index - 1] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[index - 1] + 'CancelAnimationFrame'] || window[vendors[index - 1] + 'CancelRequestAnimationFrame'];
        index--;

    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;


        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };

}());