/**
 * Created by Trent on 11/20/2016.
 */

var Tadpole = function() {
    this.MAX_SPEED = 2;
    this.MAX_FORCE = 0.2;
    this.MASS = 0.3;
    this.RADIUS = 4;
    this.MAX_ITERATION_COUNT = 4000;
    this.pos = new Vector(0, 0);
    this.vel = new Vector(0, 0);
    this.accel = new Vector(0, 0);
    this.network = null;

    this.iterationCount = 0;

    this.update = function(delta) {
        // neural net
        let average = new Vector(0, 0);
        for (let i = 0; i < State.tadpoles.length; i++) {
            let tadpole = State.tadpoles[i];

            average.add(tadpole.pos);
        }
        average.div(State.tadpoles.length);

        let input = [];
        for (let i = 0; i < State.tadpoles.length; i++) {
            let tadpole = State.tadpoles[i];

            let deltaX = tadpole.pos.x - average.x;
            let deltaY = tadpole.pos.y - average.y;

            input.push(deltaX);
            input.push(deltaY);
            input.push(tadpole.vel.x);
            input.push(tadpole.vel.y);
        }
        input.push(GameInput.mousePos[0]);
        input.push(GameInput.mousePos[1]);

        let output = this.network.activate(input);
        this.moveTo(output, delta);

        let learningRate = 0.3;
        let target = this.getTarget();
        if (this.iterationCount < this.MAX_ITERATION_COUNT) {
            this.network.propagate(learningRate, target);

            this.iterationCount++;
            console.log('Iteration: ' + this.iterationCount);
        }

        // physics
        this.boundaries();

        this.vel.add(this.accel);
        this.vel.limit(this.MAX_SPEED);
        if(this.vel.mag() < 1.5) {
            this.vel.setMag(1.5);
        }

        this.pos.add(this.vel);
        this.accel.mul(0);
    };

    this.render = function() {
        Demo.graphics.beginFill(0x2a2a2a);
        Demo.graphics.drawCircle(this.pos.x, this.pos.y, this.RADIUS);
        Demo.graphics.endFill();
    };

    this.moveTo = function(output, delta) {
        let force = new Vector(0, 0);

        let target = new Vector(this.pos.x + output[0] * Demo.renderer.width, this.pos.y + output[1] * Demo.renderer.height);
        let angle = Math.atan2(target.y - this.pos.y, target.x - this.pos.y);

        let separation = this.separate();
        let alignment = this.align().setAngle(angle);
        let cohesion = this.seek(target);

        force.add(separation);
        //force.add(alignment);
        force.add(cohesion);

        this.applyForce(force);
    };

    this.applyForce = function(force) {
        this.accel.add(force);
    };

    this.seek = function(target) {
        let seek = target.copy().sub(this.pos);
        seek.normalize();
        seek.mul(this.MAX_SPEED);
        seek.sub(this.vel).limit(0.3);

        return seek;
    };

    this.boundaries = function() {
        if (this.pos.x < 15) {
            this.applyForce(new Vector(this.MAX_FORCE * 2, 0));
        }

        if (this.pos.x > Demo.renderer.width - 15) {
            this.applyForce(new Vector(-this.MAX_FORCE * 2, 0));
        }

        if (this.pos.y < 15) {
            this.applyForce(new Vector(0, this.MAX_FORCE * 2));
        }

        if (this.pos.y > Demo.renderer.height - 15) {
            this.applyForce(new Vector(0, -this.MAX_FORCE * 2));
        }
    };

    this.align = function() {
        let sum = new Vector(0,0);
        let count = 0;

        for (let i = 0; i < State.tadpoles.length; i++) {
            let tadpole = State.tadpoles[i];

            if (tadpole != this) {
                sum.add(tadpole.vel);

                count++;
            }
        }

        sum.div(count);
        sum.normalize();
        sum.mul(this.MAX_SPEED);

        sum.sub(this.vel).limit(this.MAX_SPEED);
        sum.limit(0.1);

        return sum;
    };

    this.getTarget = function() {
        let cohesion = this.cohesion();
        let targetX = cohesion.x / Demo.renderer.width;
        let targetY = cohesion.y / Demo.renderer.height;
        let posX = this.pos.x / Demo.renderer.width;
        let posY = this.pos.y / Demo.renderer.height;
        let deltaX = targetX - posX;
        let deltaY = targetY - posY;

        let alignment = this.align();
        let targetAngle = alignment.angle();

        return [deltaX, deltaY];
    };

    this.separate = function() {
        let sum = new Vector(0, 0);
        let count = 0;
        for (let i = 0; i < State.tadpoles.length; i++) {
            let tadpole = State.tadpoles[i];

            if (tadpole !== this) {
                let distance = this.pos.dist(tadpole.pos);
                if (distance < 24 && distance > 0) {
                    let difference = this.pos.copy().sub(tadpole.pos);
                    difference.normalize();
                    difference.div(distance);
                    sum.add(difference);

                    count++;
                }
            }
        }

        let mousePos = new Vector(GameInput.mousePos[0], GameInput.mousePos[1]);
        let distance = this.pos.dist(mousePos);
        if (distance > 48) {
            let difference = this.pos.copy().sub(mousePos);
            difference.mul(-1);
            difference.normalize();
            // difference.div(distance);
            difference.mul(0.1);
            sum.add(difference);

            count++;
        }

        if (!count) {
            return sum;
        }

        sum.div(count);
        sum.normalize();
        sum.mul(this.MAX_SPEED);
        sum.sub(this.vel);
        sum.limit(this.MAX_FORCE);

        sum.mul(2);

        return sum;
    };

    this.cohesion = function() {
        let sum = new Vector(0, 0);
        let count = 0;

        for (let i = 0; i < State.tadpoles.length; i++) {
            let tadpole = State.tadpoles[i];

            if (tadpole != this) {
                sum.add(tadpole.pos);

                count++;
            }
        }

        sum.div(count);
        sum.sub(this.pos);


        return sum;
    };

    this.init = function() {
        this.pos.set(Math.random() * Demo.renderer.width, Math.random() * Demo.renderer.height);
        this.vel.random();
    };
};