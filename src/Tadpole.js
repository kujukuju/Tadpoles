/**
 * Created by Trent on 11/20/2016.
 */

var Tadpole = function() {
    this.MAX_SPEED = 2;
    this.MAX_FORCE = 0.2;
    this.MASS = 0.3;
    this.RADIUS = 4;
    this.MAX_ITERATION_COUNT = 10000;
    this.pos = new Vector(0, 0);
    this.vel = new Vector(0, 0);
    this.accel = new Vector(0, 0);
    this.network = new synaptic.Architect.Perceptron(State.TADPOLE_COUNT * 4, 25, 3);

    this.iterationCount = 0;

    this.update = function(delta) {
        // neural net
        let input = [];
        for (let i = 0; i < State.tadpoles.length; i++) {
            let tadpole = State.tadpoles[i];

            input.push(tadpole.pos.x);
            input.push(tadpole.pos.y);
            input.push(tadpole.vel.x);
            input.push(tadpole.vel.y);
        }

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

        let target = new Vector(output[0] * Demo.renderer.width, output[1] * Demo.renderer.height);
        let angle = (output[2] * Math.PI * 2) - Math.PI;

        let separation = this.separate();
        let alignment = this.align().setAngle(angle);
        let cohesion = this.seek(target);

        force.add(separation);
        force.add(alignment);
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

        let alignment = this.align();
        let targetAngle = (alignment.angle() + Math.PI) / (Math.PI * 2);

        return [targetX, targetY, targetAngle];
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

        return sum;
    };

    this.init = function() {
        this.pos.set(Math.random() * Demo.renderer.width, Math.random() * Demo.renderer.height);
        this.vel.random();
    };
};