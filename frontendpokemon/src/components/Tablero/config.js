const Config = {
    'STATUS_MYTURN': 0,             // estoy pendiente de que me toque tirar
    'STATUS_WAIT': 1,               // estoy pendiente de elegir la carta con la que jugar la mano
    'STATUS_HAVEWIN': 2,            // estoy pendiente de saber si he ganado la mano
    'STATUS_FINISH': 3,             // indicq que se ha terminado la partida
    'STATUS_HAVEWIN2': 4,           // estoy pendiente de saber si he ganado la mano/partida
    'STATUS_SHOW_INFO_HAND': 5,     // muestro la información de la mano

    'URL': 'http://localhost:3001',     // dirección del backend
}

module.exports.Config = Config;
