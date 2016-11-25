/**
 * Created by Trent on 11/20/2016.
 */

var Demo = {};

var GameInput = new StaticGameInput();
var GameLoop = new StaticGameLoop();
var GameTime = new StaticGameTime();
var Graphics = new StaticGraphics();
var State = new StaticState();

window.onload = function() {
    GameInput.init();
    Graphics.init();

    requestAnimationFrame(GameLoop.tick);
};