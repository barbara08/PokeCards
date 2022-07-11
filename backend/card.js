const config = require('./config');
const helpers = require('./helpers');

class Card {
  constructor(id, name, image, point) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.point = point;
  }
}

class Cards {
  constructor() {
    this.list_cards = [];
    this.get_cards(config.Config.NUM_CARDS_REQUEST);
  }
  // Método para llamar a la url (informacíon que nos devuelve la API, pokeapi)
  //y solicitar los datos que necesito (nombre, id, stats (dentro de stats solicitar base_stat))
  get_external_url(url){
    fetch(url)
      .then(response => response.json())
      .then(result => {
        let point = 0;
        result.stats.forEach(element => {
          //result= base_stats. effort, stat (solo queremos base_stats)
          point += element.base_stat;
        });
        // llamada a la API para solicitar información que necesito, 
        // es una 2º llamada ya que en la primera no nos devuelve toda la infirmación que necesito
        let img = `${config.Config.API.POKEAPI.IMAGE}/${result.id}.png`;
        console.log(img)
        //Creo la variable card para añadir los resultados que necesito de la API 
        //(id, nombre, imagen y puntos) 
        let card = new Card(
          result.id,
          result.name,
          img,
          point
        );
        // lo añadimos aquí porque la respuesta del fetch es asincrona
        this.list_cards.push(card);
        return card;
      })/*
      .catch(err => {
        console.log(err)
        return null;
      })*/;
    return null;
  }
  
  get_card_pokemontcg(num_cards, num_page){
    let url = `${config.Config.API.POKEMONCTG.URL}?select=id,name,images,hp&page=${num_page}&pageSize=${num_cards}`;
    fetch(url)
    .then(response => response.json())
    .then(result => {
        result.data.forEach(element => {
          if (element.hp){
            let card = new Card(
                element.id,
                element.name,
                element.images.small,
                element.hp
            );
            this.list_cards.push(card);
          }
        });
    })
    .catch(err => console.log(err))
  }

  get_cards_pokeapi(num_cards, num_page){
    //llamada a la API
    let url = `${config.Config.API.POKEAPI.URL}?limit=${num_cards}&offset=${num_page}`;
    fetch(url)
      .then(response => response.json())
      .then(result => {
          result.results.forEach(element => {
          let card = this.get_external_url(element.url);
          /* card siempre será null
          if (card){
              this.list_cards.push(card);
          }
          */
      });
    })
    .catch(err => console.log(err))
  }

  get_cards_debug_pokemontgc(){
    this.list_cards.push(...  [
      new Card (
        'sm11-5',
        'Shroomish',
        'https://images.pokemontcg.io/sm11/5.png',
        '60'
      ),
      new Card (
        'xy5-12',
        'Ludicolo',
        'https://images.pokemontcg.io/xy5/12.png',
        '130'
      ),
      new Card (
        'pl2-7',
        'Jirachi',
        'https://images.pokemontcg.io/pl2/7.png',
        '60'
      ),
      new Card (
        'xyp-XY03',
        'Froakie',
        'https://images.pokemontcg.io/xyp/XY03.png',
        '60'
      ),
      new Card (
        'dv1-13',
        'Axew',
        'https://images.pokemontcg.io/dv1/13.png',
        '50'
      ),
      new Card (
        'xy10-10',
        'Fennekin',
        'https://images.pokemontcg.io/xy10/10.png',
        '60'
      ),
      new Card(
        'g1-2',
        'M Venusaur-EX',
        'https://images.pokemontcg.io/g1/2.png',
        '230'
      ),
      new Card(
        'bw4-10',
        'Growlithe',
        'https://images.pokemontcg.io/bw4/10.png',
        '80'
      ),
      new Card(
        'xy11-13',
        'Amoonguss',
        'https://images.pokemontcg.io/xy11/13.png',
        '90'
      ),
      new Card (
        'swsh3-4',
        'Parasect',
        'https://images.pokemontcg.io/swsh3/4.png',
        '120'
      )
    ]);
  }
  get_cards_debug_pokeapi(){
    this.list_cards.push(...  [
      new Card(
        18,
        'pidgeot',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png',
        479
      ),
      new Card(
        15,
        'beedrill',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png',
        395
      ),
      new Card(
        16,
        'pidgey',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png',
        251
      ),
      new Card(
        17,
        'pidgeotto',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png',
        349
      ),
      new Card(
        147,
        'dratini',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png',
        300
      ),
      new Card(
        144,
        'articuno',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
        580
      ),
      new Card(
        145,
        'zapdos',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
        580
      ),
      new Card(
        19,
        'rattata',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png',
        253
      ),
      new Card(
        143,
        'snorlax',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
        540
      ),
      new Card(
        142,
        'aerodactyl',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png',
        515
      ),
      new Card(
        146,
        'moltres',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
        580
      ),
      new Card(
        148,
        'dragonair',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png',
        420
      ),
      new Card(
        149,
        'dragonite',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
        600
      ),
      new Card(
        150,
        'mewtwo',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
        680
      ),
      new Card(
        151,
        'mew',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
        600
      )
    ])
  }

  get_cards(num_cards) {
    console.log(num_cards);
    let num_page = helpers.between(0, 250); // random de 1 a 250

    // this.get_card_pokemontcg(num_cards, num_page);
    this.get_cards_pokeapi(num_cards, num_page);
   // this.get_cards_debug_pokemontgc();
    // this.get_cards_debug_pokeapi();
    console.log(num_cards, "end");

  }

  giveme_cards(num_cards) {
    // - Devuelve el numero de cartas que te han pedido
    // recogiéndola de forma aleatoria del listado de cartas 
    // - Elimina las cartas dadas y si tienes menos de X cartas
    // volver a pedir nuevas cartas a la api (get_cards)
    let your_card = [];
    //longitud del array son 10 cartas, cuando haya menos de 10 pedir más cartas a la API
    //conel método get_cards
    //console.log(this.list_cards);
    let length = this.list_cards.length;
  console.log(length, " < ", config.Config.MIN_CARDS_IN_MEMORY);
    if (length - num_cards <= config.Config.MIN_CARDS_IN_MEMORY) {
      this.get_cards(config.Config.NUM_CARDS_REQUEST);
    }
    /*
    for (let i = 0; i < num_cards; i++) {
      // calculo la posicion de la carta que voy a coger, que será aleatoria
      let posicion = helpers.between(1, length);
      // saco la carta del listado de cartas
      let card = this.list_cards.splice(posicion, 1);
      // añado la carta al listado de cartas a devolver
      your_card.push(card[0])
      // resto 1 a la longitud de la lista de cartas
      length -= 1;
    }
    */

    // buscamos un punto aleatorio de la lista de cartas
    let posicion = helpers.between(0, length);
    console.log("A p:", posicion, "l: ", length);
    // si cuando vayamos a coger las cartas nos sobrepasamos del tamaño de la lista de cartas
    // elegimos las últimas
    if ((posicion + num_cards) > length){
      posicion = length - num_cards;
    }
    console.log("B p:", posicion, "l: ", length);

    // sacamos las cartas del listado para darselas al jugador
    your_card = this.list_cards.splice(posicion, num_cards);

    return your_card;

  }

  show_all_cards() {
    //muestra informacion de todas las cartas que hay en memoria 
    console.log("====================");
    console.log("- ", this.list_cards);
    console.log("====================");
  }
}

module.exports = { Cards };





/* Testing*
function x() {
    console.log("Zzzz");
    //cards.show_all_cards();
    console.log(cards.giveme_cards(1));
}


const cards = new Cards();
setTimeout(x, 10000);/*
cards.giveme_cards(2);
// cards.show_all_cards();

// module.exports = { between, Card, Cards };
/*
const cards = new Cards();
// cards.show_all_cards();
cards.giveme_cards(2);


/* PRUEBA DE IMPORT Y EXPORT 
class Card{
    giveme(num_card){
        return num_card * 2;
    }
}

function mxf(){
    console.log("aaaaaaaa");
}

module.exports = { mxf, Card };
*/
