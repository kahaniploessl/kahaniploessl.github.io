// define shader variables
let theShader3;
let slimeCat;
let characters;


function preload() {
  // load files
  theShader3 = loadShader("assets/shader.vert", "assets/shader3.frag");
//   billo = loadFont('assets/BILLO.TTF');
//   gau = loadFont('assets/GAU.TTF');
//   characters = loadImage('assets/squadup.png');

}

function setup() {
  
  createCanvas(windowWidth, 1000, WEBGL);

}

function draw() {
  
  background(50,200,200);
  

  let seconds = millis() / 1000;
  
  
    
    // set new shader
    shader(theShader3);
    // set uniform data
    theShader3.setUniform("u_resolution", [width, height]);
    theShader3.setUniform("u_time", seconds);

  
  // draw rectangle relative to window size
  
  rectMode(CENTER);
  rect(0,0, width,height);
  
  
  // image(characters, 0, 0);
  
  // textFont(gau);
  // textSize(100);
  // fill(255);
  // textAlign(CENTER);
  // text('de-generate', 0,-600);

}

var pressedOnce = false;



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
