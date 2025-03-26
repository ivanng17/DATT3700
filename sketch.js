//Data from: https://worldhappiness.report/ed/2024/#appendices-and-data
//Code based on examples from: https://p5js.org/reference/

let table;

//Question array
let questions = [
  { q: "You find $500 on the ground. What do you do?", 
    answers: ["Keep it and save it.", "Spa day.", "Spend it on fun.", "Give it to someone in need."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "Which statement do you agree with the most?", 
    answers: ["Success is measured by financial security.", "Good health is the foundation of happiness.", "Life is about experiencing everything.", "Helping others is what truly fulfills me."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "If you could have one of the following, \nwhich would you choose?", 
    answers: ["A million dollars.", "Perfect health for life.", "The ability to go anywhere, anytime.", "The power to end poverty."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "How do you handle the stress of life?", 
    answers: ["Work harder to secure my future.", "Exercise or meditate.", "Travel or be spontaneous.", "Volunteer work."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "Your ideal vacation would be:", 
    answers: ["A luxury resort.", "A wellness retreat.", "Backpacking across different countries.", "Volunteering abroad."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "What motivates you in life?", 
    answers: ["Building financial security.", "Taking care of my body and mind.", "The excitement of new experiences.", "Making a positive impact on others."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "If you had unlimited resources, what would you do?", 
    answers: ["Invest and grow my wealth.", "Develop medical advancements.", "Travel the world with no limits.", "Fund charities and help others."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "Which of these would stress you out the most?", 
    answers: ["Losing all my money.", "Becoming seriously ill.", "Being trapped in one place.", "Seeing others suffer."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "How do you measure success?", 
    answers: ["By the amount of wealth I accumulate.", "By my physical and mental well-being.", "By how freely I can live my life.", "By the number of people I help."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "What would make you feel the most fulfilled in life?", 
    answers: ["Being financially independent.", "Living a long, healthy life.", "Having total freedom.", "Knowing I made a difference in others' lives."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "Where would you prioritize govermental resources?", 
    answers: ["Economic growth.", "Health care", "Protecting civil liberties", "Education and social programs"],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  }
];

//Initializing variables
let currentQuestion = -1;
let wealthScore = 0;
let healthScore = 0;
let freedomScore = 0;
let generosityScore = 0;
let surveyState = 1;
let selectedCategory;
let result = ""; // Global variable to store the chosen category
let restartButton;

let starOffsets = [];
let twinkleSpeeds = [];
let noiseOffsets = [];
let stars = [];
let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
let pointerX, pointerY;
let touchInput = false;
let STAR_COUNT;
let STAR_SIZE = 3;
let STAR_MIN_SCALE = 0.2;
let OVERFLOW_THRESHOLD = 50;
let scaleFactor;
let selectedStar = null; // Stores the clicked star
let infoBox;
let infoBox2;

function preload(){
  // Loading the data from the world happiness report
  table = loadTable("dataset.csv", "csv", "header");
  //Loading fonts
  questionFont = loadFont("CinzelDecorative-Regular.ttf")
  answerFont = loadFont("Raleway-Medium.ttf")
  
  star = loadImage("star.png");

  healthSound = loadSound("Sound 1.mp3");
  wealthSound = loadSound("Sound 2.mp3");
  freedomSound = loadSound("Sound 3.mp3");
  generositySound = loadSound("Sound 4.mp3");
  starSound = loadSound("starSound.mp3");

  healthSound.setVolume(0.7);
  wealthSound.setVolume(0.4);
  freedomSound.setVolume(0.7);
  generositySound.setVolume(0.4);
  starSound.setVolume(0.2);

  backgroundMusic = loadSound("background.mp3");

  wealthImage = loadImage("wealth.png");
  healthImage = loadImage("health.png");
  freedomImage = loadImage("freedom.png");
  generosityImage = loadImage("generosity.png");

}

function setup() {
  //Setting window size
  createCanvas(1920, 1080);
  userStartAudio(); // Call userStartAudio()
  backgroundMusic.loop(); // Play the sound
  background(0);

  //Getting the data from each column of the data set
  country = table.getColumn("Country");
  wealth = table.getColumn("Wealth");
  health = table.getColumn("Health");
  freedom = table.getColumn("Freedom");
  generosity = table.getColumn("Generosity");
  x = table.getColumn("x");
  y = table.getColumn("y");
  


  //testing arrays
/*
  print(country)
  print(wealth)
  print(health)
  print(freedom)
  print(generosity)
*/
  
    for (let i = 0; i < country.length; i++) {
    starOffsets.push(createVector(random(-2, 2), random(-2, 2))); // Small movement offsets
    twinkleSpeeds.push(random(0.01, 0.05)); // Twinkle speed variation
    noiseOffsets.push(random(1000)); // Unique Perlin noise seed for each star
  }
  
   createCanvas(windowWidth, windowHeight);
    STAR_COUNT = (width + height) / 8; 
    scaleFactor = window.devicePixelRatio || 1;
  
  infoBox = createDiv('').style('display', 'none')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.7)')
        .style('color', 'white')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('font-family', 'Arial, sans-serif');
  
  infoBox2 = createDiv('').style('display', 'none')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.7)')
        .style('color', 'white')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('font-family', 'Arial, sans-serif');
  
    generateStars();
  
  // Create Restart Button
    restartButton = createButton('Restart');
    restartButton.position(width * 0.01, height * 0.0185);
    restartButton.mousePressed(goToTitle);
  
  // Style the button
    restartButton.style('background-color', 'black');  
    restartButton.style('color', 'white');            
  //restartButton.style('padding', '10px 20px');      
    restartButton.style('border', '2px solid white'); 
    restartButton.style('border-radius', '5px');      
    restartButton.hide(); 

}


function draw() {
  background(0);

  // Chooses which state is being displayed on the website
  if (surveyState == 1){
    showTitle();
    restartButton.hide(); 
  }
  else if (surveyState == 2){
    showQuestion();
    restartButton.hide();
  }
  else if (surveyState == 3){
    showResult();
    restartButton.hide();
  }
  else{
    showAnim();
    restartButton.show();
  }
}

function createBackground(){
  //creates background
  let grad = drawingContext.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.8, height * 0.8, width * 0.9);
  grad.addColorStop(0, color(121, 68, 154, 125)); // Add purple color at center
  grad.addColorStop(1, color(0, 0, 0, 0)); // Fade to transparent
  drawingContext.fillStyle = grad;
  rectMode(CORNER);
  rect(0, 0, width, height);
}

function mousePressed() {
  if (surveyState > 3) {
    let closestStar = null;
    let minDist = 15; // Click detection radius

    for (let i = 0; i < country.length; i++) {
      let starX = x[i];
      let starY = y[i];
      let d = dist(mouseX, mouseY, starX, starY);

      if (d < minDist) {
        closestStar = i;
        minDist = d;
    }
  }

  if (closestStar !== null) {
    let countryName = country[closestStar];
    let countryHealth = health[closestStar];
    let countryWealth = wealth[closestStar];
    let countryFreedom = freedom[closestStar];
    let countryGenerosity = generosity[closestStar];
  }

    for (let star of stars) {
        let d = dist(mouseX, mouseY, star.x, star.y);
        if (d < STAR_SIZE * 3) {
            selectedStar = star;
            starSound.play();
            return;
        }
    }
    
    //remove the stats display if click outside
    selectedStar = null;
  }
}

function keyPressed() {
  // If the user inputs a key at the title screen, go to the questions
  if ((key == '1' || key == '2' || key == '3' || key == '4') && (surveyState == 1)){
    surveyState++;
  }
  
  // If the user inputs a choice, add points to the specified category
  if ((key == '1') && (currentQuestion < questions.length) && (surveyState == 2)){
    wealthScore++;
    currentQuestion++;
    wealthSound.play();
  }
  if ((key == '2') && (currentQuestion < questions.length) && (surveyState == 2)){
    healthScore++;
    currentQuestion++;
    healthSound.play();
  }
  if ((key == '3') && (currentQuestion < questions.length) && (surveyState == 2)){
    freedomScore++;
    currentQuestion++;
    freedomSound.play();
  }
  if ((key == '4') && (currentQuestion < questions.length) && (surveyState == 2)){
    generosityScore++;
    currentQuestion++;
    generositySound.play();
  }

  // If the user answers all the questions, go to the result screen
  if (currentQuestion >= questions.length) {
    surveyState++;
  }
  
}

let titleDisplayed = false; 

function showTitle() {
  noStroke();
  // Drawing background
  createBackground();

  // Main title text
  textFont(questionFont);
  textSize(width * 0.05);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("A CONSTELLATION OF \n YOUR HAPPINESS", width / 2, height / 2);
  drawingContext.shadowBlur = 0;
  
  // Input prompt to start quiz text
  textFont(answerFont);
  textSize(width * 0.026);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("Place your hand over a beacon to begin", width / 2, height / 2 + height / 4);
  drawingContext.shadowBlur = 0;
  
  // Credits text
  textFont(answerFont);
  textSize(width * 0.01);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("Created by: Team Red \n Fuad, Luca, Rabiha, Miaoshu, Tessa & Ivan", width / 2, height / 2 + height / 4 * 1.75);
  drawingContext.shadowBlur = 0;
 
}


function showQuestion() {
  //Create background
  createBackground();

  //Display the question
  textFont(questionFont);
  textSize(width * 0.026);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 5;
  text(questions[currentQuestion].q, width / 2, height * 0.115);
  drawingContext.shadowBlur = 0;

  //Progress bar
  rectMode(CENTER);
  noFill();
  stroke(255);
  rect(width / 2, height - height * 0.023, width * 0.52, width * 0.013, height * 0.023);

  rectMode(CORNER);
  fill(255);
  noStroke();
  rect((width / 4) - width * 0.0078, height - height * 0.03, (width * 0.515) / questions.length + (width * 0.515)/questions.length * currentQuestion, width * 0.0078, height * 0.023);

  textAlign(LEFT);
  textSize(width * 0.013);
  text("Q#" + (currentQuestion + 1) + " / 11", width / 2 + width * 0.265, height - height * 0.03);


  //Displays the prompts for the users to choose
  for (let i = 0; i < 4; i++) {
    let x = width/2;
    let y = (height * 0.28) + (i * height * 0.13);
    let w = width * 0.417;
    let h = height * 0.09;
    
    noStroke();
    rectMode(CENTER);

    //Wealth
    if (i == 0){
      fill(0, 255, 0, 50);
      stroke(0, 255, 0);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(wealthImage, x/2 + x/8, y, width * 0.018, height * 0.046)
    }
    //Health
    if (i == 1){
      fill(255, 0, 0, 50);
      stroke(255, 0, 0);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(healthImage, x/2 + x/8, y, width * 0.026, height * 0.046);

    }
    //Freedom
    if (i == 2){
      fill(0, 0, 255, 50);
      stroke(0, 0, 255);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(freedomImage, x/2 + x/8, y, width * 0.026, height * 0.027);

    }
    //Generosity
    if (i == 3){
      fill(255, 255, 255, 50);
      stroke(255, 255, 255);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(generosityImage, x/2 + x/8, y, width * 0.026, height * 0.046);

    }

    noStroke();
    textSize(width * 0.015);
    fill(255);
    textAlign(CENTER);
    textFont(answerFont);
    text(questions[currentQuestion].answers[i], x, y);
  }
}

function showResult() {
  let maxScore = 0;
//  let result = "";

  // Draw background
  createBackground();

  //Display which value was prioritized the most by the user
  maxScore = max(wealthScore, healthScore, freedomScore, generosityScore);
  
  if (maxScore == wealthScore){
    result = "Wealth";
  }
  if (maxScore == healthScore){
    result = "Health";
  }  
  if (maxScore == freedomScore){
    result = "Freedom";
  }  
  if (maxScore == generosityScore){
    result = "Generosity";
  }

  //Display the results
  noFill();
  fill(255);
  textSize(width * 0.039);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("Your view of happiness is: " + result, width / 2, height / 2);
  drawingContext.shadowBlur = 0;
}

function drawSky() {
  let c1 = color(10, 10, 30);  // Dark blue
  let c2 = color(40, 0, 50);   // Dark purple
  let c3 = color(0, 50, 40);   // Dark green
  
  // Create gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let col;
    if (y < height / 2) {
      col = lerpColor(c1, c2, inter * 2);
    } else {
      col = lerpColor(c2, c3, (inter - 0.5) * 2);
    }
    stroke(col);
    line(0, y, width, y);
  } 
}

function showAnim() {
    drawSky();
    updateStars();
    renderStars();

    if (selectedStar) {
        displayStats(selectedStar);
    }
}

//function to get top 15

function getTop15Countries(selectedCategoryIndex) {
  let maxScore = max(wealthScore, healthScore, freedomScore, generosityScore);
  
  if (maxScore === wealthScore) {
    selectedCategory = wealth;
  } else if (maxScore === healthScore) {
    selectedCategory = health;
  } else if (maxScore === freedomScore) {
    selectedCategory = freedom;
  } else if (maxScore === generosityScore) {
    selectedCategory = generosity;
  }

  //array of objects containing the country index and its value in the selected category
  
  let indexedValues = [];
  for (let i = 0; i < selectedCategory.length; i++) {
    indexedValues.push({
      index: i,
      name: country[i], 
      value: float(selectedCategory[i]),
    });
  }

  //sort by descending value
  indexedValues.sort((a, b) => b.value - a.value);
  const top15 = indexedValues.slice(0, 15);

   // console.log("Top 10 countries:", top10.map(item => `${item.name}: ${item.value}`));

  //get top 10 values
  return top15;
}

//star animation functions 

function generateStars() {
    stars = [];
    for (let i = 0; i < table.getRowCount(); i++) {
        let country = table.getRow(i);
        stars.push({
            x: random(width),
            y: random(height),
            z: STAR_MIN_SCALE + random(1 - STAR_MIN_SCALE),
            country: {
                name: country.getString(0),
                health: country.getNum(1),
                wealth: country.getNum(2),
                freedom: country.getNum(3),
                generosity: country.getNum(4)
            }
        });
    }
}

function updateStars() {
    velocity.tx *= 0.65;
    velocity.ty *= 0.65;
    velocity.x += (velocity.tx - velocity.x) * 0.8;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    for (let star of stars) {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || 
            star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
            recycleStar(star);
        }
    }
}

function recycleStar(star) {
  let safeWidth = width > 0 ? width : windowWidth;
  let safeHeight = height > 0 ? height : windowHeight;
  
  star.z = STAR_MIN_SCALE + random(1 - STAR_MIN_SCALE);
    
  let newX = random(safeWidth);
  let newY = random(safeHeight);
    
    //fallback if width/height is not valid
  if (isNaN(newX) || isNaN(newY)) {
    console.warn('Width or height is invalid, using default size.');
      newX = random(1920); 
      newY = random(1080); 
  }
    
  
  star.x = random(width > 0 ? width : windowWidth);
  star.y = random(height > 0 ? height : windowHeight);
}

function renderStars() {
    let top15 = getTop15Countries(selectedCategory); //get top 10 

    for (let star of stars) {
       let isTop15 = top15.some(top => top.name === star.country.name);
        let starSize = isTop15 ? STAR_SIZE * 3 : STAR_SIZE * star.z * scaleFactor; // Larger for top 10
        let brightness = isTop15 ? 255 : 100; //brighter for top 10
        let alpha = isTop15 ? 1 : (0.5 + 0.5 * random()); 

        //glow effect for top 10 stars
        if (isTop15) {
            noStroke();
            for (let i = 5; i > 0; i--) {
              let glowAlpha = map(i, 1, 5, 25, 2); //glow layers
              fill(255, glowAlpha);
              ellipse(star.x, star.y, starSize * 1.5 * i, starSize * 1.5 * i);
            }
        }

        //main star rendering
      stroke(255, 255, 255, alpha * 255);
      strokeWeight(starSize);
      line(star.x, star.y, star.x - velocity.x * 2, star.y - velocity.y * 2);
    }
}

function mouseMoved() {
  if (surveyState > 3) {
        touchInput = false;
        movePointer(mouseX, mouseY);
        let foundStar = null;

        for (let star of stars) {
            let d = dist(mouseX, mouseY, star.x, star.y);
            if (d < STAR_SIZE * 3) {
                foundStar = star;
                break;
            }
        }

        if (foundStar) {
            infoBox2.html(`
                <strong>${foundStar.country.name}</strong><br>
            `).style('display', 'block').position(mouseX + 10, mouseY + 10);
        } else {
            if (infoBox2) {
                infoBox2.hide();  
            }
        }
    } else {
        if (infoBox2) {
            infoBox2.hide(); 
        }
    }
}

function movePointer(x, y) {
    if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX;
        let oy = y - pointerY;
        velocity.tx += (ox / 8 * scaleFactor) * (touchInput ? 1 : -1);
        velocity.ty += (oy / 8 * scaleFactor) * (touchInput ? 1 : -1);
    }
    pointerX = x;
    pointerY = y;
}



function displayStats(star) {
    let panelX = constrain(40, 10, width - 250); 
    let panelY = constrain(50, 10, height - 200);
    
    strokeWeight(2);
    stroke(200);
    
    fill(0, 200); //semi-transparent background
    rect(panelX, panelY, 230, 160, 10); 

    noStroke();
    fill(255);
    textSize(12);
    textAlign(LEFT, TOP);
    text(`Country: ${star.country.name}`, panelX + 10, panelY + 10);

    let stats = [
        { label: "Health", value: star.country.health, color: color(207, 89, 89) },
        { label: "Wealth", value: star.country.wealth, color: color(95, 180, 95) },
        { label: "Freedom", value: star.country.freedom, color: color(63, 135, 202) },
        { label: "Generosity", value: star.country.generosity, color: color(214, 229, 234) }
    ];

    let maxValue = max(stats.map(s => s.value));
    let barWidth = 100; 
    let barHeight = 10; 

    for (let i = 0; i < stats.length; i++) {
        let stat = stats[i];
        let barLength = map(stat.value, 0, maxValue, 0, barWidth);

        fill(255);
        text(stat.label, panelX + 10, panelY + 35 + i * 25);
       
        fill(stat.color);
        rect(panelX + 80, panelY + 35 + i * 25, barLength, barHeight, 3);
    }
}

function goToTitle() {
    //resetting variables
    surveyState = 1;  
    currentQuestion = -1; 
    wealthScore = 0;
    healthScore = 0;
    freedomScore = 0;
    generosityScore = 0;
    selectedCategory = null;
    result = "";  
    selectedStar = null;

    //hide any existing info box
    if (infoBox) {
        infoBox.hide();
    }

    restartButton.hide();
}
