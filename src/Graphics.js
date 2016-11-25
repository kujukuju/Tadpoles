/**
 * Created by Trent on 11/20/2016.
 */

var StaticGraphics = function() {
    this.init = function() {
        Demo.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor: 0xfafafa, antialias: true});
        Demo.graphics = new PIXI.Graphics();
        document.body.appendChild(Demo.renderer.view);

        Demo.stage = new PIXI.Container();
        Demo.stage.addChild(Demo.graphics);

        for (let i = 0; i < State.TADPOLE_COUNT; i++) {
            let tadpole = new Tadpole();
            tadpole.init();
            tadpole.network = globalNetwork;

            State.tadpoles[i] = tadpole;
        }
    };
};