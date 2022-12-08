let air = [];
let lightning = [];
let detect = 5; // radius of detection for splitting beam

function setup() {
    createCanvas(900, 400);

    // create initial set of particles
    for (let i = 0; i < 500; i++) {
        air.push(new airParticle(random(0, width), random(0, height)));
    }

    // create initial lightining line
    lightning.push(new particleLightning(random(100, 800), -20, 0));
}
  
function draw() {
    background(0);

    // creates a new lightning line every 300 frames
    if (frameCount % 300 === 0) {
        lightning.push(new particleLightning(random(100, 800), -20, frameCount));
    }

    // general function for creating new beams from particle collision
    for (let beam of lightning) {
        beam.update();
        for (let particle of air) {
            // collision detection
            if (beam.newX < particle.posX + detect && beam.newX > particle.posX - detect && 
                beam.newY < particle.posY + detect && beam.newY > particle.posY - detect) {

                // creates 2 new beams from the collision spot
                lightning.push(new particleLightning(beam.newX, beam.newY, frameCount));
                lightning.push(new particleLightning(beam.newX, beam.newY, frameCount));
                
                // deletes particle that was hit
                let index = air.indexOf(particle);
                if (index > -1) {
                    air.splice(index, 1);
                }
            }
        }
        // deletes beams 200 frames after their creation, creates a sweeping decay effect
        if (frameCount - beam.timeCreated > 200) {
            beam.color = "black";
            let beamIndex = lightning.indexOf(beam);
            if (beamIndex > -1) {
                lightning.splice(beamIndex, 1);
            }
        }
        beam.display();
    }

    // endlessly supplies the particle array with new particles
    for (let particle of air) {
        if (air.length < 500) {
            air.push(new airParticle(random(0, width), random(0, height)));
        }
        particle.update();
        particle.display();
    }
}


function airParticle(x, y) {
    this.posX = x;
    this.posY = y;
    this.vecX = random(-1, 1);
    this.vecY = random(-1, 1);
    this.size = 3;

    // move in a random direction, bounce off boundaries
    this.update = function() {
        if (this.posX > 900 || this.posX < 0) {
            this.vecX *= -1;
        }
        if (this.posY > 400 || this.posY < 0) {
            this.vecY *= -1;
        }

        this.posX += this.vecX;
        this.posY += this.vecY;
    } 

    // simple white particle
    this.display = function() {
        push();
        noStroke();
        fill("white");
        rect(this.posX, this.posY, this.size);
        pop();
    }
}

function particleLightning(x, y, t) {
    this.posX = x;
    this.posY = y;

    // random slope
    this.rise = random(2, 4);
    this.run = random(-3, 3);

    this.color = "cyan";
    this.timeCreated = t;
    this.newX = x;
    this.newY = y;

    this.update = function() {
        this.newY += this.rise;
        this.newX += this.run;
    }

    this.display = function() {
        push();
        stroke(this.color);
        strokeWeight(4);
        line(this.posX, this.posY, this.newX, this.newY);
        pop();
    }
}