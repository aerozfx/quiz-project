import { serverResponse, MAX_QUESTIONS } from "./fetch.js";
const formSelector = document.querySelector(".main-container form");
//CREA LA IMAGEN Y LOS POSIBLES INPUTS COMO RESPUESTA
const createQuestion = (data, index) => {
  const article = document.createElement("article");
  article.className = "question-container";
  article.innerHTML = `        
  <h2 class="question-number">PREGUNTA ${index}/${MAX_QUESTIONS}</h2>
  <p class="question-text">¿CÓMO SE LLAMA ESTE POKÉMON?</p>
  <img src="${data.image}" alt="${data.name}"/>`;
  formSelector.appendChild(article);
};

const createAnswers = (data) => {
  const articleSelector = document.querySelector(".question-container");
  const section = document.createElement("section");
  section.className = "answer-section";
  section.innerHTML = `
  <input
  class="radio"
  type="radio"
  value="${data.name}"
  name="pregunta"
  id="respuesta2"
  />
  <label class="answer-label" for="respuesta2">
  ${data.name}
  </label>`;
  articleSelector.appendChild(section);
};

// CREA UNA PREGUNTA POR ARRAY DE PROMESAS
serverResponse.then((data) => {
  data.map((item, i) => {
    // SE GENERA UN INDICE ALEATORIO PARA ACCEDER A UNA POSICIÓN ALEATORIA
    // Y SE RESUELVE EL OBJETO PROMESA CORRESPONDIENTE A ESE ÍNDICE
    let num = Math.floor(Math.random() * 4);
    item[num].then((data) => createQuestion(data, i + 1));
    item.map((poke, i) => {
      poke.then((res) => createAnswers(res));
    });
  });
});
