/**
 * Created by Trent on 11/20/2016.
 */

var StaticState = function() {
    this.TADPOLE_COUNT = 9;
    this.tadpoles = [];

    window.globalNetwork = new synaptic.Architect.Perceptron(this.TADPOLE_COUNT * 4 + 2, this.TADPOLE_COUNT * 4 + 2, 2);

    this.update = function() {
        let delta = GameTime.getDeltaTime();
        delta = 16;

        for (let i = 0; i < this.tadpoles.length; i++) {
            this.tadpoles[i].update(delta);
        }

        GameTime.update();
    };

    this.render = function() {
        Demo.renderer.render(Demo.stage);
        Demo.graphics.clear();

        for (let i = 0; i < this.tadpoles.length; i++) {
            this.tadpoles[i].render();
        }
    };
};