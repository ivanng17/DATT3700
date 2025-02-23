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
let scores = { "Wealth": 0, "Health": 0, "Freedom": 0, "Generosity": 0 };
let finished = false;

function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  background(0);
  
  if (finished) {
    showResult();
  } else {
    showQuestion();
  }
}

function showQuestion() {
  textSize(60);
  fill(255);
  textAlign(CENTER, CENTER);
  text(questions[currentQuestion].q, width / 2, 100);
  
  for (let i = 0; i < 4; i++) {
    let x = width/2;
    let y = 300 + i * 140;
    let w = 800;
    let h = 100;
    
    rectMode(CENTER);
    fill(50);
    rect(x, y, w, h, 50);
    fill(255);
    textSize(40);
    text(questions[currentQuestion].answers[i], x, y);
  }
}

function mousePressed() {
  if (finished) return;
  
  for (let i = 0; i < 4; i++) {
    let x = width/2;
    let y = 300 + i * 140;
    let w = 800;
    let h = 100;
    
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      scores[questions[currentQuestion].points[i]]++;
      
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
      } else {
        finished = true;
      }
      break;
    }
  }
}

function showResult() {
  let maxScore = 0;
  let result = "";
  
  for (let key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      result = key;
    }
  }
  
  textSize(100);
  textAlign(CENTER, CENTER);
  text("Your view of happiness is: " + result, width / 2, height / 2);
}
