/**
 * Created by Trent on 11/20/2016.
 */

var Demo = {};

var GameLoop = new StaticGameLoop();
var GameTime = new StaticGameTime();
var Graphics = new StaticGraphics();
var State = new StaticState();

window.onload = function() {
    Graphics.init();

    requestAnimationFrame(GameLoop.tick);
};