//Data from: https://worldhappiness.report/ed/2024/#appendices-and-data
//Code based on examples from: https://p5js.org/reference/

let table;

let questions = [
  { q: "You find $500 on the ground. What do you do?", 
    answers: ["Keep it and save it.", "Spa day.", "Spend it on fun.", "Give it to someone in need."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "Which statement do you agree with the most?", 
    answers: ["Success is measured by financial security.", "Good health is the foundation of happiness.", "Life is about experiencing everything.", "Helping others is what truly fulfills me."],
    points: ["Wealth", "Health", "Freedom", "Generosity"]
  },
  { q: "If you could have one of the following, which would you choose?", 
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

let currentQuestion = 0;
let wealthScore = 0;
let healthScore = 0;
let freedomScore = 0;
let generosityScore = 0;
let finished = false;

function preload(){
  // Loading the data from the world happiness report
  table = loadTable("dataset.csv", "csv", "header");
  questionFont = loadFont("OpenSauceTwo-SemiBold.ttf")
  answerFont = loadFont("Raleway-Medium.ttf")
}

function setup() {
  createCanvas(1920, 1080);
  background(0);
  
  //Getting the data from each column of the data set
  country = table.getColumn("Country");
  wealth = table.getColumn("Wealth");
  health = table.getColumn("Health");
  freedom = table.getColumn("Freedom");
  generosity = table.getColumn("Generosity");

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
  
  if (finished == true) {
    showResult();
  } else {
    showQuestion();
  }
}

function showQuestion() {
  let grad = drawingContext.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.8, height * 0.8, width * 0.9);
  grad.addColorStop(0, color(121, 68, 154, 125)); // Add purple color at center
  grad.addColorStop(1, color(0, 0, 0, 0)); // Fade to transparent
  drawingContext.fillStyle = grad;
  rectMode(CORNER);
  rect(0, 0, width, height);

  textFont(questionFont);
  textSize(50);
  fill(255);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 5;
  text(questions[currentQuestion].q, width / 2, 125);
  drawingContext.shadowBlur = 0;

  
  for (let i = 0; i < 4; i++) {
    let x = width/2;
    let y = 300 + i * 140;
    let w = 800;
    let h = 100;
    
    noStroke();
    rectMode(CENTER);
    fill(255, 10);
    rect(x, y, w, h, 50);
    fill(255);
    textSize(30);
    textFont(answerFont);
    text(questions[currentQuestion].answers[i], x, y);
  }
}

function keyPressed() {
  if (finished == true) {
    return;
  }
    
  if (key == '1' && currentQuestion < questions.length){
    wealthScore++;
    currentQuestion++;
  }
  if (key == '2' && currentQuestion < questions.length){
    healthScore++;
    currentQuestion++;
  }
  if (key == '3' && currentQuestion < questions.length){
    freedomScore++;
    currentQuestion++;
  }
  if (key == '4' && currentQuestion < questions.length){
    generosityScore++;
    currentQuestion++;
  }

  if (currentQuestion >= questions.length) {
    finished = true;
  }
}


function showResult() {
  let maxScore = 0;
  let result = "";

  let grad = drawingContext.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.8, height * 0.8, width * 0.9);
  grad.addColorStop(0, color(121, 68, 154, 125)); // Add purple color at center
  grad.addColorStop(1, color(0, 0, 0, 0)); // Fade to transparent
  drawingContext.fillStyle = grad;
  drawingContext.shadowBlur = 0;
  rectMode(CORNER);
  rect(0, 0, width, height);

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

  noFill();
  fill(255);
  textSize(75);
  textAlign(CENTER, CENTER);
  drawingContext.shadowColor = 'white';
  drawingContext.shadowBlur = 10;
  text("Your view of happiness is: " + result, width / 2, height / 2);
}


