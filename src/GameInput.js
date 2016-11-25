/**
 * Created by Trent on 11/21/2016.
 */

var StaticGameInput = function() {
    this.mousePos = [0, 0];

    this.init = function() {
        document.addEventListener('mousemove', function(e) {
            this.mousePos = [e.clientX, e.clientY];
        }.bind(this));
    };
};