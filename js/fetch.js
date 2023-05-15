let pokeArray = [];
const POKE_ENDPOINT = `https://pokeapi.co/api/v2/pokemon-form/`;
export const MAX_QUESTIONS = 5;

// Rellenamos el array de ENDPOINTS de los cuales obtenemos, las imágenes y los nombres de las posibles respuestas
const fillPokeArrays = (arr) => {
  for (let i = 0; i < MAX_QUESTIONS; i++) {
    let pokeName = [];
    let num = Math.ceil(Math.random() * 1000);
    if (num === 0) {
      num++;
    }
    pokeName.push(POKE_ENDPOINT + num);
    for (let j = 0; j < 3; j++) {
      let num = Math.floor(Math.random() * 1000);
      pokeName.push(POKE_ENDPOINT + num);
    }
    arr.push(pokeName);
  }
};
const getPokemons = async (arr) => {
  // Este array obtiene los nombres e imágenes de los POKEMON correctos
  let promises = arr.map(async (item) => {
    // ARRAY DE PROMESAS POR CADA ITEM DE POKEARRAY
    return item.map(async (poke) => {
      const result = await fetch(poke);
      const response = await result.json();
      let { name, sprites: image } = response;
      return { name, image };
    });
  });
  const fetchedData = await Promise.all(promises);
  return fetchedData.map((item) => {
    // Cada ítem es un array de 4 promesas
    return item.map((ele) => {
      // Resolvemos cada promesa
      return ele.then((poke) => {
        let pokemon = {};
        let { name, image: images } = poke;
        let { front_default: img } = images;
        pokemon["image"] = img;
        pokemon["name"] = name;
        return pokemon;
      });
    });
  });
};
fillPokeArrays(pokeArray);
export const serverResponse = getPokemons(pokeArray);
