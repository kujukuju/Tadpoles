/**
 * Created by Trent on 2/24/2015.
 */

var StaticGameLoop = function() {
    this.tick = function() {
        GameTime.update();

        State.update();

        State.render();

        // TODO only using set timeout for development so there's no fps cap
        setTimeout(GameLoop.tick, 0);
        // requestAnimationFrame(GameLoop.tick);
    };
};