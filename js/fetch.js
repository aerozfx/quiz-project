let pokeArray = [];

const fillPokeArray = (arr) => {
  for (let i = 0; i < 10; i++) {
    let num = Math.floor(Math.random() * 1000);
    arr.push(`https://pokeapi.co/api/v2/pokemon/${num}`);
  }
};
const getPokemons = (arr) => {
  // Creamos un array de promesas
  let promises = arr.map((item) => {
    return fetch(`${item}`)
      .then((res) => res.json())
      .then((data) => {
        let { name, sprites: image } = data;
        return { name, image };
      });
  });
  return Promise.all(promises).then((data) => {
    let answers = data.map((item) => {
      let { front_default: pokeImagen } = item.image;
      let pokemon = {};
      pokemon["name"] = item.name;
      pokemon["image"] = pokeImagen;
      return pokemon;
    });
    return answers;
  });
};
fillPokeArray(pokeArray);
let serverResponse = getPokemons(pokeArray).then((data) => {
  let input;
  console.log(data);
});
