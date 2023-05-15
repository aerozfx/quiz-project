import { serverResponse, MAX_QUESTIONS } from "./fetch.js";

// FUNCIONALIDAD .BUTTON-START
const startButton = document.querySelector(".button-start");
startButton.addEventListener("click", () => {
  const preLoadSection = document.querySelector(".pre-load");
  preLoadSection.classList.toggle("hide");
});

const formSelector = document.querySelector(".main-container form");

// CREAMOS TANTOS SECTION CON LA CLASE QUESTION-CONTAINER COMO NÚMERO DE PREGUNTAS HAYA
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
const createAnswers = (data, idx, i) => {
  const section = document.querySelectorAll(".answers");
  const article = document.createElement("article");
  article.className = "answer-article";
  article.innerHTML = `
  <input
  class="radio"
  type="radio"
  value="${data.name}"
  name="pregunta"
  id="respuesta${i}"
  />
  <label class="answer-label" for="respuesta${idx}">
  ${data.name}
  </label>`;
  section[i].appendChild(article);
};

const processQuestion = async (item, i) => {
  // RECIBE UN ARRAY CON 4 PROMESAS Y LAS RESUELVE
  let num = Math.floor(Math.random() * 4);
  const questionData = await item[num];
  createQuestion(questionData, i);
  // CREA 4 POSIBLES RESPUESTAS CON LOS VALORES DE LA POSICIÓN ACTUAL (ITEM) DEL ARRAY DE PROMESAS
  const answerPromises = item.map((poke, index) =>
    poke.then((res) => createAnswers(res, index, i))
  );
  await Promise.all(answerPromises);
};

// CREA UNA PREGUNTA POR ARRAY DE 4 PROMESAS -> LA LONGITUD DEL ARRAY DEPENDERÁ DE LAS PREGUNTAS MÁXIMAS CONFIGURADAS
serverResponse.then(async (data) => {
  for (let i = 0; i < data.length; i++) {
    await processQuestion(data[i], i);
  }
});
