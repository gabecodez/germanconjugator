import { verbs } from "./german_verb_game_verbs";
import confetti from "canvas-confetti";

const defaults = {
  disableForReducedMotion: true,
};

function fire(
  particleRatio: number,
  opts: {
    spread: number;
    startVelocity?: number;
    origin: { x: number; y: number };
    decay?: number;
  }
) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(200 * particleRatio),
    })
  );
}

function confettiExplosion(origin: { x: number; y: number }) {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin,
  });
  fire(0.2, {
    spread: 60,
    origin,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    origin,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    origin,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    origin,
  });
}

const pronouns = ["ich", "du", "er", "wir", "ihr", "sie", "SieF"];
const imperativePronouns = ["du", "ihr", "SieF"];
const displayPronouns = [
  "ich",
  "du",
  "er/sie",
  "wir",
  "ihr",
  "sie (plural)",
  "Sie",
];
const displayImperativePronouns = ["du", "ihr", "Sie"];
const tenses = [
  "präsens",
  "präteritum",
  "perfekt",
  "plusquamperfekt",
  "futurI",
  "futurII",
  "imperativ",
  "konjunktivI",
  "konjunktivII",
];
const displayTenses = {
  präsens: "Präsens",
  präteritum: "Präteritum",
  perfekt: "Perfekt",
  plusquamperfekt: "Plusquamperfekt",
  futurI: "Futur I",
  futurII: "Futur II",
  imperativ: "Imperativ",
  konjunktivI: "Konjunktiv I",
  konjunktivII: "Konjunktiv II",
};

let selectedVerbs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Indices of initially selected verbs
let selectedTenses = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Indices of initially selected tenses

let currentVerb: { infinitive: any; conjugations: any } | null = null;
let currentPronoun: string | null = null;
let currentDisplayPronoun = null;
let currentTense: string | null = null;
let currentDisplayTense = null;

function getRandomVerbIndex(): number {
  const randomIndex =
    selectedVerbs[Math.floor(Math.random() * selectedVerbs.length)];
  return randomIndex;
}

function getRandomPronounIndex() {
  const randomIndex = Math.floor(Math.random() * pronouns.length);
  return randomIndex;
}

function getRandomImperativePronounIndex() {
  const randomIndex = Math.floor(Math.random() * imperativePronouns.length);
  return randomIndex;
}

function getRandomTenseIndex(): number {
  const randomIndex =
    selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
  return randomIndex;
}

function displayNewVerb() {
  const verbIndex = getRandomVerbIndex();
  const tenseIndex = getRandomTenseIndex();

  currentVerb = verbs[verbIndex];
  currentTense = tenses[tenseIndex];
  currentDisplayTense = displayTenses[currentTense];

  if (currentTense === "imperativ") {
    const pronounIndex = getRandomImperativePronounIndex();
    currentPronoun = imperativePronouns[pronounIndex];
    currentDisplayPronoun = displayImperativePronouns[pronounIndex];
  } else {
    const pronounIndex = getRandomPronounIndex();
    currentPronoun = pronouns[pronounIndex];
    currentDisplayPronoun = displayPronouns[pronounIndex];
  }

  document.getElementById(
    "display"
  ).innerText = `${currentDisplayPronoun} + ${currentVerb.infinitive}`;
  document.getElementById("tenseDisplay").innerText = `${currentDisplayTense}`;
  document.getElementById("inputVerb").value = "";
  document.getElementById("result").innerText = "";
  document.getElementById("result").style.display = "none";
}

function checkAnswer() {
  const userAnswer = (
    document.getElementById("inputVerb") as HTMLFormElement
  ).value.trim();
  const correctAnswer = currentVerb.conjugations[currentTense][currentPronoun];
  const resultElement = document.getElementById("result");
  const trigger = document.getElementById("button");

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    resultElement.innerText = "Correct!";
    resultElement.style.color = "green";

    const rect = trigger.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const origin = {
      x: center.x / window.innerWidth,
      y: center.y / window.innerHeight,
    };
    confettiExplosion(origin);

    setTimeout(displayNewVerb, 3000); // display new verb after checking answer
  } else {
    resultElement.innerText = `Incorrect! The correct form is ${correctAnswer}.`;
    resultElement.style.color = "red";
    resultElement.style.display = "block";
  }
}

function insertChar(char: any) {
  const input = document.getElementById("inputVerb");
  if (input != null) {
    input.value += char;
    input.focus();
  }
}

function toggleOptionsPanel() {
  const panel = document.getElementById("optionsPanel") as HTMLElement;
  panel.style.display = panel.style.display === "flex" ? "none" : "flex";

  const coverpanel = document.getElementById("cover-panel") as HTMLElement;
  coverpanel.style.display =
    coverpanel.style.display === "flex" ? "none" : "flex";
}

function saveOptions() {
  // Retrieve selected verbs
  selectedVerbs = [];
  document
    .querySelectorAll('input[name="verbs"]:checked')
    .forEach((checkbox) => {
      selectedVerbs.push(parseInt(checkbox.value));
    });

  // Retrieve selected tenses
  selectedTenses = [];
  document
    .querySelectorAll('input[name="tenses"]:checked')
    .forEach((checkbox) => {
      selectedTenses.push(parseInt(checkbox.value));
    });

  // Example usage: Filter verbs and tenses based on selections
  const verbsToPractice = verbs.filter((verb, index) =>
    selectedVerbs.includes(index)
  );
  const tensesToPractice = [
    "präsens",
    "präteritum",
    "perfekt",
    "plusquamperfekt",
    "futurI",
    "futurII",
    "imperativ",
    "konjunktivI",
    "konjunktivII",
  ].filter((tense, index) => selectedTenses.includes(index));

  // Use verbsToPractice and tensesToPractice in your game logic
  console.log("Verbs to practice:", verbsToPractice);
  console.log("Tenses to practice:", tensesToPractice);
  displayNewVerb(); // Reset to a new verb and tense after saving options
  toggleOptionsPanel();
}

// Initialize game with first verb
displayNewVerb();

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Checkbox event listeners
document
  .querySelectorAll('input[type="checkbox"][name="verbs"]')
  .forEach(function (el) {
    el.addEventListener("change", function () {
      selectedVerbs = Array.from(
        document.querySelectorAll(
          'input[type="checkbox"][name="verbs"]:checked'
        )
      ).map(function (el) {
        return parseInt(el.value, 10);
      });
    });
  });

document
  .querySelectorAll('input[type="checkbox"][name="tenses"]')
  .forEach(function (el) {
    el.addEventListener("change", function () {
      selectedTenses = Array.from(
        document.querySelectorAll(
          'input[type="checkbox"][name="tenses"]:checked'
        )
      ).map(function (el) {
        return parseInt(el.value, 10);
      });
    });
  });
