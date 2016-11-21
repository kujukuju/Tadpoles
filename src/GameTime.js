/**
 * Created by Trent on 2/26/2015.
 */

var StaticGameTime = function() {
    this.lastTime = 0;
    this.currentTime = 0;
    this.fpsLastUpdateTime = 0;
    this.fpsFramesSinceLastUpdate = 0;
    this.fps = 0;

    this.update = function() {
        this.lastTime = this.currentTime;
        this.currentTime = new Date().getTime();

        if (this.currentTime - this.fpsLastUpdateTime >= 1000) {
            this.fps = this.fpsFramesSinceLastUpdate;
            this.fpsLastUpdateTime = this.currentTime;
            this.fpsFramesSinceLastUpdate = 0;
        }
        this.fpsFramesSinceLastUpdate++;
    };

    this.getDeltaTime = function() {
        return this.currentTime - this.lastTime;
    };

    this.getDeltaTimeSeconds = function() {
        return this.getDeltaTime() / 1000;
    };

    this.getFPS = function() {
        return this.fps;
    };

    this.getCurrentTimeImmediate = function() {
        return new Date().getTime();
    };

    this.init = function() {
        this.lastTime = new Date().getTime();
        this.fpsLastUpdateTime = this.lastTime;
        this.fpsFramesSinceLastUpdate = 0;
        this.fps = 0;
        this.currentTime = this.lastTime;
    };
    this.init();
};