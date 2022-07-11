const Config = {
    'NUM_CARDS_BY_MATCH': 8,
    'MIN_CARDS_IN_MEMORY': 6,   // numero minimo de cartas que puede haber en memoria
    'NUM_CARDS_REQUEST': 30,    // numero de cartas con las que se inicializa el servicio de Card
    'API': {
        'POKEAPI': {
            'URL': 'https://pokeapi.co/api/v2/pokemon/',
            'IMAGE': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
        },          
        'POKEMONCTG': {
            'URL': 'https://api.pokemontcg.io/v2/cards/',
        }
    },
    'ACCESSTOKENSECRET': 'youraccesstokensecret', // frase para generar el token junto con la información del usuario

}

module.exports.Config = Config;
