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
    answers: ["Economic growth.", "Health care", "Protecting civil liberties", "Education and social programes"],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  }
];

//Initializing variables (currentquestion is -1 because the code is weird)
let currentQuestion = -1;
let wealthScore = 0;
let healthScore = 0;
let freedomScore = 0;
let generosityScore = 0;
let surveyState = 1;
 
function preload(){
  // Loading the data from the world happiness report
  table = loadTable("dataset.csv", "csv", "header");
  
  //Loading fonts
  questionFont = loadFont("CinzelDecorative-Regular.ttf")
  answerFont = loadFont("Raleway-Medium.ttf")

  //loading images
  star = loadImage("star.png");

  wealthImage = loadImage("wealth.png");
  healthImage = loadImage("health.png");
  freedomImage = loadImage("freedom.png");
  generosityImage = loadImage("generosity.png");
}

function setup() {
  //Setting window size
  createCanvas(1920, 1080);
  background(0);
  
  //Getting the data from each column of the data set
  country = table.getColumn("Country");
  wealth = table.getColumn("Wealth");
  health = table.getColumn("Health");
  freedom = table.getColumn("Freedom");
  generosity = table.getColumn("Generosity");
  x = table.getColumn("x");
  y = table.getColumn("y");

  //setting up the box that appears when you click on a star
infoBox = createDiv('');
infoBox.style('position', 'absolute');
infoBox.style('background', 'rgba(0, 0, 0, 0.7)');
infoBox.style('color', 'white');
infoBox.style('padding', '10px');
infoBox.style('border-radius', '5px');
infoBox.style('font-family', 'Arial, sans-serif');
infoBox.hide(); 

  
  //testing arrays
/*
  print(country)
  print(wealth)
  print(health)
  print(freedom)
  print(generosity)
*/
}


function draw() {
  background(0);
  
  // Chooses which state is being displayed on the website
  if (surveyState == 1){
    showTitle();
  }
  else if (surveyState == 2){
    showQuestion();
  }
  else if (surveyState == 3){
    showResult();
  }
  else{
    showAnim();
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

    //check if star is near minimum required distance from mouse click
    for (let i = 0; i < country.length; i++) {
      let starX = x[i];
      let starY = y[i];
      let d = dist(mouseX, mouseY, starX, starY);

      if (d < minDist) {
        closestStar = i;
        minDist = d;
    }
  }

  // Show statistics on star click
  if (closestStar !== null) {
    let countryName = country[closestStar];
    let countryHealth = health[closestStar];
    let countryWealth = wealth[closestStar];
    let countryFreedom = freedom[closestStar];
    let countryGenerosity = generosity[closestStar];

    infoBox.html(`
      <strong>${countryName}</strong><br>
      Health: ${countryHealth}<br>
      Wealth: ${countryWealth}<br>
      Freedom: ${countryFreedom}<br>
      Generosity: ${countryGenerosity}
    `);
    infoBox.position(mouseX + 10, mouseY + 10);
    infoBox.show();
  } else {
    infoBox.hide();
  }
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
  }
  if ((key == '2') && (currentQuestion < questions.length) && (surveyState == 2)){
    healthScore++;
    currentQuestion++;
  }
  if ((key == '3') && (currentQuestion < questions.length) && (surveyState == 2)){
    freedomScore++;
    currentQuestion++;
  }
  if ((key == '4') && (currentQuestion < questions.length) && (surveyState == 2)){
    generosityScore++;
    currentQuestion++;
  }

  // If the user answers all the questions, go to the result screen
  if (currentQuestion >= questions.length) {
    surveyState++;
  }
}


function showTitle() {
  // Drawing background
  createBackground();

  // Main title text
  textFont(questionFont);
  textSize(100);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("A CONSTELLATION OF \n YOUR HAPPINESS", width / 2, height / 2);
  drawingContext.shadowBlur = 0;
  
  // Input prompt to start quiz text
  textFont(answerFont);
  textSize(50);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("Place your hand over a beacon to begin", width / 2, height / 2 + height / 4);
  drawingContext.shadowBlur = 0;
  
  // Credits text
  textFont(answerFont);
  textSize(20);
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
  textSize(50);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 5;
  text(questions[currentQuestion].q, width / 2, 125);
  drawingContext.shadowBlur = 0;

  //Progress bar
  rectMode(CENTER);
  noFill();
  stroke(255);
  rect(width / 2, height - 25, 1000, 25, 25);

  rectMode(CORNER);
  fill(255);
  noStroke();
  rect(width / 4 - 15, height - 32.5, 90 + 90 * currentQuestion, 15, 25);

  textAlign(LEFT);
  textSize(25);
  text("Q#" + (currentQuestion + 1) + " / 11", width / 2 + 505, height - 32.5);


  //Displays the prompts for the users to choose
  for (let i = 0; i < 4; i++) {
    let x = width/2;
    let y = 300 + i * 140;
    let w = 800;
    let h = 100;
    
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
      image(wealthImage, x/2 + x/8, y, 35, 50)
    }
    //Health
    if (i == 1){
      fill(255, 0, 0, 50);
      stroke(255, 0, 0);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(healthImage, x/2 + x/8, y, 50, 50);

    }
    //Freedom
    if (i == 2){
      fill(0, 0, 255, 50);
      stroke(0, 0, 255);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(freedomImage, x/2 + x/8, y, 50, 30);

    }
    //Generosity
    if (i == 3){
      fill(255, 255, 255, 50);
      stroke(255, 255, 255);
      rect(x, y, w, h, 50);
      noStroke();
      imageMode(CENTER);
      tint(255, 127);
      image(generosityImage, x/2 + x/8, y, 50, 50);

    }

    noStroke();
    textSize(30);
    fill(255);
    textAlign(CENTER);
    textFont(answerFont);
    text(questions[currentQuestion].answers[i], x, y);
  }
}

function showResult() {
  let maxScore = 0;
  let result = "";

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
  textSize(75);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("Your view of happiness is: " + result, width / 2, height / 2);
  drawingContext.shadowBlur = 0;
}

function showAnim() {
  createBackground();

  //Show stars
  for (let i = 0; i < country.length; i++){
    drawingContext.shadowColor = 'white';
    drawingContext.shadowBlur = 10;
    let starX = x[i];
    let starY = y[i];
    tint(255, 255);
    image(star, starX, starY, 10, 10);
    drawingContext.shadowBlur = 0;
  }
}



