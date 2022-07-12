const uuid = require('uuid');
const helpers = require('./helpers');


async function save_data(result, nick, ip) {
    let conn;
    let partidas_ganadas = result['is_win'] == 1 ? 1 : 0;
    let puntos_ganados = result['marker']['player'];
    let partidas_empatadas = result['is_win'] == -1 ? 1 : 0;
    let partidas_perdidas = result['is_win'] == 0 ? 1 : 0;
    let puntos_perdidos = result['marker']['rival'];
    let partidas_jugadas = 1;
    let query_insert = `INSERT INTO pokecards.ranking (
        nick, ip, partidas_ganadas, puntos_ganados, partidas_empatadas, partidas_perdidas, puntos_perdidos, partidas_jugadas
    ) values (
        '${nick}', '${ip}', ${partidas_ganadas}, ${puntos_ganados}, ${partidas_empatadas}, ${partidas_perdidas}, ${puntos_perdidos}, ${partidas_jugadas}
    )`
    let query_update = `UPDATE ranking set
            partidas_ganadas = partidas_ganadas + ${partidas_ganadas}, 
            puntos_ganados = puntos_ganados + ${puntos_ganados}, 
            partidas_empatadas = partidas_empatadas + ${partidas_empatadas}, 
            partidas_perdidas = partidas_perdidas + ${partidas_perdidas}, 
            puntos_perdidos = puntos_perdidos + ${puntos_perdidos}, 
            partidas_jugadas = partidas_jugadas + ${partidas_jugadas}
    WHERE  nick = '${nick}' AND ip = '${ip}'`;
    console.log(query_insert);
    console.log(query_update);
    try {
      conn = await helpers.pool_connections.getConnection();
      const res = await conn.query(query_insert);
      console.log(res);
  
    } catch (err) {
        conn = await helpers.pool_connections.getConnection();
        const res = await conn.query(query_update);
        console.log(res);
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }


class Player {
    constructor(nick, ip, game, is_bot=false) {
        this.nick = nick;
        this.id = this.#generate_id();
        this.ip = ip;
        this.game = game;
        this.is_bot = is_bot;

        this.position_in_game = this.game.add_player(this);
        this.list_cards = this.game.giveme_cards();
    }
    // metodo privado para generar el id único
    #generate_id(){
        return uuid.v4();
    }
    change_game(game){
        this.game = game;
        //Añado al jugador a la posición del juego
        this.position_in_game = this.game.add_player(this);
        //Las cartas dadas lo pasamoss a list_cards
        this.list_cards = this.game.giveme_cards();
    }
    test(){
        return this.nick + " - " + this.id;
    }
    // me toca
    my_turn() {
        return this.game.your_turn(this.position_in_game);
    }
    rival_cards_hand(){
        // devolvemos información de la carta que ha usado el rival en la mano actual
        return this.game.get_card_rival_for_hand(this.position_in_game);
    }
    // tirar una carta en una mano
    toss_card(card_id) {
        /*
        devolvemos el numero de mano que hemos jugado o false si la carta es invalida (undefined)
        */
        // averiguamos si la carta es valida
        let card = this.list_cards.find(card => card.id == card_id);
        if (card != undefined){
            // cogemos la informacion de que mano estamos jugando antes de tirar la carta y se actualice
            let hand = this.get_hand();
            // le decimos al juego la carta que vamos a tirar, el juego se encarga de actualizar la mano actual
            this.game.toss(card);
            return hand;
        }else{
            return false;
        }
    }
    // averigua si ha ganado la mano, teniendo en cuenta si se ha terminado la mano
    am_i_winner(hand){
        // pregunta al juego si ha ganado la mano

        let result = {
            'wait': true,       // nos indica si se ha terminado la mano o debemos volver a preguntar
            'is_win': null,     // indica si hemos ganado (1), hemos perdido (0) o hemos empatado ( -1)
            'marker': null,     // si ha terminado la mano, devolvemos informacion del marcador
            'continue': null,   // si ha terminado la mano, decimos si se ha acabado el juego
            'used_cards': null  // cartas usadas en la mano
        };

        /*
        esto responde 4 casos:
            - espera que no ha terminado la mano -> undefined
            - has gandado la mano -> 1
            - has perdido la mano -> 0
            - se ha empatado la mano -> -1
        */
        let am_i_winner = this.game.have_win_hand(this.position_in_game, hand);

        if (am_i_winner !== undefined) {
            result['wait'] = false
            result['is_win'] = am_i_winner;
            result['marker'] = this.get_marker();
            result['continue'] = this.continue_playing();
            result['used_cards'] = this.info_hand(hand);

            if (result['continue'] === false){
                // guardamos los datos en bbdd cuando termina la partida
                save_data(result, this.nick, this.ip);
            }
        }
        return result;
    }

    // indica si continuamo jugando
    continue_playing(){
        
        return this.game.continue_playing();
        
    }

    // información sobre el rival
    get_rival(){
        // el juegno nos da la informacion de nuestro rival

        return this.game.get_info_rival(this.position_in_game);
    }

    // información sobre el marcador de la partida
    get_marker(){
        // el juengo nos dice como va la partida (marcador)
        return this.game.get_marker(this.position_in_game);
        // {me: 0, rival: 0}
    }
    info_hand(hand){
        // nos devuelve las cartas usadas en la mano indicada
        return this.game.info_hand(hand, this.position_in_game);
        // {me: 0, rival: 0}
    }

    // devuelve informacion sobre el jugador
    get_info(cards_hidden){
        // devuelve el nick y el listado de cartas con las que se inicia una partida
        let info = {
            nick: this.nick,
            cards: []
        }
        if (cards_hidden == true){
            // borrar la informacion de las cartas (nombre, image, id, etc)
            info.cards = [];
            for (let i = 10; i < 14; i++) {
                let card = {
                    'id': i,
                    'name': '',
                    'image': "",
                    'point': 0
                };
                info.cards.push(card);
            }
        }else{
            info.cards = this.list_cards;
        }
        return info;
    }

    // devuelve el número de mano que se esta jugando
    get_hand(){
        return this.game.number_hands_played;
    }
}

module.exports = { Player };
