//
// loader
//
var loader = {
    loaded: true,
    loadedCount: 0, // Assets that have been loaded so far
    totalCount: 0, // Total number of assets that need to be loaded

    init: function () {
        var mp3Suport, oggSupport;
        var audio = document.createElement("audio");
        if (audio.canPlayType) {
            mp3Suport = "" != audio.canPlayType("audio/mpeg");
            oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
        } else {
            mp3Suport = false;
            oggSupport = false;
        }

        loader.soundFileExtn = oggSupport ? ".ogg" : mp3Suport ? ".mp3" : undefined;
    },
    loadImage: function (url) {
        this.totalCount++;
        this.loaded = false;
        $(".loading-screen").show();
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    soundFileExtn: ".ogg",
    loadSound: function (url) {
        this.totalCount++;
        this.loaded = false;
        $(".loading-screen").show();
        var audio = new Audio();
        audio.src = url + loader.soundFileExt;
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        return audio;
    },
    itemLoaded: function () {

        loader.loadedCount++;
        // display loadedcount and totalcount
        if (loader.loadedCount === loader.totalCount) {
            // Loader has loaded completley..
            loader.loaded = true;
            // Hide the loading Screen 
            $(".loading-screen").hide();
            // and call the loader.onload method if it exists
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    },
};