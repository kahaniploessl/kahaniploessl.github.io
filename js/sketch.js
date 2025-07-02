let dotHeight = 23; // Can be adjusted dynamically
let frame = 400;
let length = frame / (dotHeight - 1);
let pl = []; // Main points
let subDots = []; // Sub-dots
let visitedDots = []; // Track visited dots

let moveDelay = 1; // Delay in frames
let lastMoveTime = 0; // To track when the last move occurred
let pathGenerating = true; // To track whether path generation is happening

let maxMoves = 250; // Cap on the number of moves in the Kolam path
let currentMoves = 0; // Current number of moves made

let r,g,b;

// x,y coordinates
let x = 0;
let y = 0;

// width and height
let w;
let h;

// slope
let mX, mY;
// angle of rotation
let theta;

let count = 0;

let limit;
let trigger;

let iteration = 7;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  frame = 600;
  length = frame / (dotHeight - 1);
  
  
  generateDiamondDots(dotHeight);
  generateSubDots();
  visitedDots.push(getBottomMostPoint()); // Start from the bottom-most point
  
  
  // background('#f2eae4');
  w = width;
  h = height;
  x = w / 2;
  y = h / 3;
  mX = 0;
  mY = 1;
  
  limit = floor(random(10, 50));
  trigger = floor(random(25, 50));
  
  r=random(240,255);
  g=random(240,255);
  b=random(200,225);
}

function draw() {
  // backSketch();
  if (pathGenerating) {
    generateKolamPath();
  }
}


// Function to generate the diamond grid of dots
function generateDiamondDots(dotHeight) {
  let step = 1;
  let increasing = true;
  let centerX = width / 2;
  let centerY = height / 2;
  let verticalShift = centerY - ((dotHeight - 1) * length) / 2;

  for (let b = 0; b < dotHeight; b++) {
    let rowY = b * length + verticalShift;
    let numDots = step;

    for (let a = 0; a < numDots; a++) {
      let xPos = centerX + (a - (numDots - 1) / 2) * length;
      pl.push(createVector(xPos, rowY));
      strokeWeight(5); // Make dots invisible
      point(xPos, rowY);
    }

    if (increasing) {
      step += 2;
    } else {
      step -= 2;
    }

    if (step > dotHeight) {
      increasing = false;
      step -= 4;
    }
  }
}

// Function to generate sub-dots around main dots
function generateSubDots() {
  let subLength = length / 2;

  for (let i = 0; i < pl.length; i++) {
    let mainPoint = pl[i];
    let north = createVector(mainPoint.x, mainPoint.y - subLength);
    let south = createVector(mainPoint.x, mainPoint.y + subLength);
    let east = createVector(mainPoint.x + subLength, mainPoint.y);
    let west = createVector(mainPoint.x - subLength, mainPoint.y);

    subDots.push(north, south, east, west);

    stroke(0, 255, 0);
    strokeWeight(0);
    point(north.x, north.y);
    point(south.x, south.y);
    point(east.x, east.y);
    point(west.x, west.y);
  }
}

function generateKolamPath() {
  let currentTime = frameCount;

  // Check if enough time has passed for the next move
  if (currentTime - lastMoveTime >= moveDelay) {
    let current = visitedDots[visitedDots.length - 1]; // Get the last visited point
    let nextPoint = getNextPoint(current);

    // If there's a valid next point and we haven't reached the max moves
    if (nextPoint && currentMoves < maxMoves) {
      visitedDots.push(nextPoint);
      currentMoves++; // Increment the number of moves made
      
      
      blendMode(DIFFERENCE);
      noFill();
      
      stroke(g,r,b);
      strokeWeight(tan(frameCount)*10);
      // strokeWeight(3);
      
      kolam();
      
      // blendMode(BLEND);
      // fill(0,100,220,100);
      // rect(0,0,width,height);

      
      blendMode(DIFFERENCE);
      noFill();
      stroke(sin(r),222,b);
      strokeWeight(5*sin(frameCount));
      // strokeWeight(1);
      
      kolam();
      

      lastMoveTime = currentTime; // Update the last move time
    } else if (currentMoves >= maxMoves) {
      console.log('Max moves reached, stopping path generation.');
      pathGenerating = false; // Stop path generation once the max moves are reached
      reset(); // Reset only the Kolam path (without regenerating points)
    } else {
      console.log('No valid next point found, ending path generation.');
      pathGenerating = false; // Stop path generation if no valid point is found
      reset(); // Reset only the Kolam path (without regenerating points)
    }
  }
}


function kolam(){     
  for (let i=0;i<4;i++){
    push();
      angleMode(DEGREES);
      rotateAbout(90*i,width/2,height/2)
      angleMode(RADIANS);
      kolamArm();
    pop();
       
   }
      
}

function kolamArm() {
  // Draw the continuous path with handling for 90-degree turns
      beginShape();
      for (let i = 0; i < visitedDots.length - 2; i++) {
        let p0 = visitedDots[i];
        let p1 = visitedDots[i + 1];
        let p2 = visitedDots[i + 2];

        // Calculate the angle between the previous segment and the next segment
        let angle1 = atan2(p1.y - p0.y, p1.x - p0.x);
        let angle2 = atan2(p2.y - p1.y, p2.x - p1.x);
        let angleDiff = abs(degrees(angle2 - angle1));

        // If the angle between the two segments is close to 90 degrees, use bezierVertex
        if (angleDiff > 80 && angleDiff < 100) {
          let controlPoint = createVector(
            (p0.x + p2.x) / 2, 
            (p0.y + p2.y) / 2
          );
          bezierVertex(p1.x, p1.y, controlPoint.x, controlPoint.y, p2.x, p2.y);
        } else {
          // Otherwise, just draw a smooth line between points using Catmull-Rom
          let p3 = visitedDots[i + 3] || p2;  // If no next point, loop back to p2
          let curvePoint = catmullRom(p0, p1, p2, p3, 0.5);
          vertex(curvePoint.x, curvePoint.y);
        }
      }
      endShape();
}

// Function to get the bottommost point
function getBottomMostPoint() {
  return subDots.reduce((bottom, point) => (point.y > bottom.y ? point : bottom));
}

// Function to get the next point to visit
function getNextPoint(current) {
  let subLength = length / 2;
  let diagonalDistance = sqrt(2 * pow(subLength, 2));  // Pythagorean theorem for diagonal

  // Exclude the last visited point (the point just before the current one)
  let lastVisited = visitedDots[visitedDots.length - 2];

  // Allow some tolerance in distance, dynamically adjusting based on dotHeight
  let tolerance = subLength * 0.5; // Tolerance relative to subLength and dotHeight

  // Filter possible moves to avoid the last visited point (the one immediately before the current point)
  let possibleMoves = subDots.filter(p => {
    let distToCurrent = dist(current.x, current.y, p.x, p.y);
    return Math.abs(distToCurrent - diagonalDistance) < tolerance && !isLastVisited(p, lastVisited);  // Tolerance check
  });

  // console.log(`Possible moves from (${current.x.toFixed(2)}, ${current.y.toFixed(2)}):`);
  // possibleMoves.forEach(p => console.log(`  (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`));

  // Select a move from available adjacent points
  if (possibleMoves.length === 0) return null;
  return random(possibleMoves);  // Randomly select a move from available adjacent points
}

// Function to check if a point is the last visited point
function isLastVisited(point, lastVisited) {
  if (!lastVisited) return false;  // In case there is no last visited point
  return point.x === lastVisited.x && point.y === lastVisited.y;
}

// Catmull-Rom spline interpolation function
function catmullRom(p0, p1, p2, p3, t) {
  let x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t);
  let y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t);
  return createVector(x, y);
}

// Reset function to restart the path generation without regenerating points
function reset() {
  // Clear the previous Kolam path (only)
  // delayBySeconds(1);
  clear();
  background(0);
  r=random(240,255);
  g=random(240,255);
  b=random(200,225);
  console.log("r:"+r+"g:"+g+"b:"+b)
  visitedDots = []; // Reset the visited dots list
  currentMoves = 0; // Reset the current moves count
  pathGenerating = true; // Restart path generation
  visitedDots.push(getBottomMostPoint());  // Reset start point

  // console.log('Kolam path reset complete.');
background(0);
}

function delayBySeconds(seconds) {
  let startTime = millis(); // Current time in milliseconds
  
  while (millis() - startTime < seconds * 1000) {
    // Busy-wait loop (not recommended for long delays)
  }
  
  // console.log(`${seconds} seconds have passed.`);
}