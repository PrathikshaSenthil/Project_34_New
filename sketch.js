// This is a new version story of our very own angry birds
// He tries to destroy the 'Green pig' who tries to occupy the Angry birds land
// So many battles are going on as shown in the background
// Please join them to help angry birds to win
// If the pig touches the Slingshot he wins...So beware of the pigs!
                        // **All the Best**\\


const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, sling, ground, grip, king;
var birds = [];
var kings = [];

var score=0;
var kingAnimation = [];
var kingSpritedata, kingSpritesheet;

var CrykingAnimation = [];
var CrykingSpritedata, CrykingSpritesheet;

function preload() {
  backgroundImg = loadImage("./assets/background2.gif");
  slingImage = loadImage("./assets/sling.png");
  kingSpritedata = loadJSON("assets/king/pig.json");
  kingSpritesheet = loadImage("assets/king/pig.png");
  CrykingSpritedata = loadJSON("assets/king/Kingcry.json");
  CrykingSpritesheet = loadImage("assets/king/Kingg.png");

}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  sling = new slingShot(150, 350, 160, 310);
  grip = new Sling(180, 250, 210, 150, angle);

  var kingFrames = kingSpritedata.frames;
  for (var i = 0; i < kingFrames.length; i++) {
    var pos = kingFrames[i].position;
    var img = kingSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    img.scale=1;
    kingAnimation.push(img);
  }
  
  var CrykingFrames = CrykingSpritedata.frames;
  for (var i = 0; i <  CrykingFrames.length; i++) {
    var pos =  CrykingFrames[i].position;
    var img =  CrykingSpritesheet.get(pos.x, pos.y-200, pos.w, pos.h);
    CrykingAnimation.push(img);
  }


}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);


  Engine.update(engine);
  ground.display();

  showKings();

  for (var i = 0; i < birds.length; i++) {
    showAngryBirds(birds[i], i);
    for (var j = 0; j < kings.length; j++) {
      if (birds[i] !== undefined && kings[j] !== undefined) {
        var collision = Matter.SAT.collides(birds[i].body, kings[j].body);
        if (collision.collided) {
          kings[j].remove(j);
          score=score+1;
          Matter.World.remove(world, birds[i].body);
          birds.splice(i, 1);
          i--;
          
        
        }
      }
    }
  }

  grip.display();
  sling.display();

fill("green");
stroke("black");
strokeWeight(3);
textSize(25);
textFont("castellar");
text("Score :   "+score,100,100);
}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === 32) {
    var angryBird = new AngryBird(grip.x, grip.y);
    angryBird.trajectory = [];
    Matter.Body.setAngle(angryBird.body, grip.angle);
    birds.push(angryBird);
  }
}

// function to show the ball.
function showAngryBirds(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    birds.splice(index, 1);
    
  }
}


//function to show the King
function showKings() {
  if (kings.length > 0) {
    if (
      kings.length < 4 &&
      kings[kings.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var king = new King(
        width,
        height - 100,
        170,
        170,
        position,
        kingAnimation
      );

      kings.push(king);
    }

    for (var i = 0; i < kings.length; i++) {
      Matter.Body.setVelocity(kings[i].body, {
        x: -0.9,
        y: 0
      });

      kings[i].display();
      kings[i].animate();
      var collision = Matter.SAT.collides(sling.body, kings[i].body);
   
    }
  } else {
    var king = new King(width, height - 60, 170, 170, -60, kingAnimation);
    kings.push(king);
    
  }
}


//releasing the Angry bird on key release
function keyReleased() {
  if (keyCode === 32) {
    birds[birds.length - 1].shoot();
  }
}
