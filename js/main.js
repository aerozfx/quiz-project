import { serverResponse, MAX_QUESTIONS } from "./fetch.js";
// FUNCIONALIDAD .BUTTON-START
const startButton = document.querySelector(".button-start");
startButton.addEventListener("click", () => {
  const audio = document.querySelector("#audio");
  const start = new Audio("assets/audio/start.wav");
  audio.pause();
  start.play();
  const preLoadSection = document.querySelector(".pre-load");
  preLoadSection.classList.toggle("hide");
  document.body.style.overflow = "unset";
});
// SELECTOR DEL FORMULARIO
const formSelector = document.querySelector(".main-container form");

// CREAMOS TANTOS SECTION CON LA CLASE QUESTION COMO NÚMERO DE PREGUNTAS HAYA
const createMaxNumQuestions = (numQuestions) => {
  for (let i = 0; i < numQuestions; i++) {
    const questionContainer = document.createElement("section");
    questionContainer.className = "question";
    questionContainer.id = `pregunta-${i}`;
    const answersContainer = document.createElement("section");
    answersContainer.className = "answers";
    questionContainer.appendChild(answersContainer);
    formSelector.appendChild(questionContainer);
  }
};
createMaxNumQuestions(MAX_QUESTIONS);

const questionSelector = document.querySelectorAll(".question");
const answersSelector = document.querySelectorAll(".answers");
//CREA LA ESTRUCTURA HTML DE LA IMAGEN ESCOGIDA EN PROCESSQUESTION()
const createQuestion = (data, index) => {
  const section = document.createElement("section");
  section.className = `question-container question-${index}`;
  section.innerHTML = `        
  <h2 class="question-number">PREGUNTA ${index + 1}/${MAX_QUESTIONS}</h2>
  <p class="question-text">¿CÓMO SE LLAMA ESTE POKÉMON?</p>
  <img class="question-image" src="${data.image}" alt="${data.name}"/>`;
  questionSelector[index].insertBefore(section, answersSelector[index]);
};

// CREA LA ESTRUCTURA HTML DE LAS POBIBLES RESPUESTAS EN FUNCIÓN A LA IMAGEN
// ESCOGIDA DE MANERA ALEATORIA EN PROCESSQUESTION
const createAnswers = (data, i) => {
  const section = document.querySelectorAll(".answers");
  const article = document.createElement("article");
  article.className = "answer-article";
  article.innerHTML = ` 
  <input
  class="radio"
  type="radio"
  value="${data.name}"
  name="question-${i}"
  id="${data.name}"
  />
    <label class="answer-label" for="${data.name}">
    ${data.name}
    </label>`;
  section[i].appendChild(article);
};

const createSubmitButton = () => {
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "button-submit";
  button.innerHTML = "ENVIAR";
  formSelector.appendChild(button);
};

const processQuestion = async (item, i) => {
  // RECIBE UN ARRAY CON 4 PROMESAS Y LAS RESUELVE
  let num = Math.floor(Math.random() * 4);
  const questionData = await item[num];
  createQuestion(questionData, i);
  // CREA 4 POSIBLES RESPUESTAS CON LOS VALORES DE LA POSICIÓN ACTUAL (ITEM) DEL ARRAY DE PROMESAS
  const answerPromises = item.map((poke) =>
    poke.then((res) => createAnswers(res, i))
  );
  await Promise.all(answerPromises);
};

const getAnswers = () => {
  const images = document.querySelectorAll(".question-image");
  let anwers = [];
  images.forEach((img) => {
    anwers.push(img.alt);
  });
  return anwers;
};

const getInputsByUser = () => {
  const inputs = document.querySelectorAll('input[type="radio"]');
  let inputsArr = [];
  inputs.forEach((item) => {
    if (item.checked) {
      inputsArr.push(item.value);
    }
  });
  return inputsArr;
};

const checkAnswers = (arr1, arr2) => {
  return arr1.filter((item, index) => item === arr2[index]).length;
};

const showResults = (num) => {
  // Añadimos la regla overflow: hidden, para evitar el scroll vertical
  document.body.style.overflow = "hidden";
  const darkBG = document.createElement("div");
  darkBG.classList.add("modal");
  darkBG.style.top = `${window.scrollY}px`;
  const result = document.createElement("div");
  result.innerHTML = `      
  <h2>TU RESULTADO ES:</h2>
  <h4>${num}/${MAX_QUESTIONS}</h4>
  <button class="button-reset">RESET</button>`;
  result.classList.toggle("modal-result");
  darkBG.appendChild(result);
  document.querySelector(".main-container").appendChild(darkBG);

  if (num === MAX_QUESTIONS) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    let success = new Audio("assets/audio/success.wav");
    success.play();
  }
};

// CREA UNA PREGUNTA POR ARRAY DE 4 PROMESAS -> LA LONGITUD DEL ARRAY DEPENDERÁ DE LAS PREGUNTAS MÁXIMAS CONFIGURADAS
// ADEMÁS CREAMOS EL BOTON DE SUBMIT DESPUÉS DE CREAR LAS PREGUNTAS
serverResponse.then(async (data) => {
  for (let i = 0; i < data.length; i++) {
    await processQuestion(data[i], i);
  }
  createSubmitButton();
  const submitButton = document.querySelector(".button-submit");

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const anserws = getAnswers();
    const userInputs = getInputsByUser();
    showResults(checkAnswers(anserws, userInputs));
    const buttonReset = document.querySelector(".button-reset");
    buttonReset.addEventListener("click", () => formSelector.submit());
  });
});
