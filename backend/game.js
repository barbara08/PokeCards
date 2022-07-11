const helpers = require('./helpers');
const config = require('./config');

class Game {
    constructor(cards){
        // Listado de cartas con las que jugará los jugadores
        this.list_cards = cards.giveme_cards(config.Config.NUM_CARDS_BY_MATCH);

        // Listado de jugadores
        this.list_players = [];
        // Jugador al que le toca jugar
        this.next_player = null;
        // Mano, en cada posición vamos a guardar la carta que ha tirado cada jugador
        this.game_hand = [null, null];
        // información de cada una de las manos jugadas
        this.info_game_hand = [];
        /* en la información de la mano vamos a guardar la siguiente informacion
        {
            'cards': [null, null],  // cartas usadas en la mano
            'winner': null,         // posición del jugador que ha ganado, -1 si ha empatado
        };
        */
        // Puntos partidas (marcador por cada jugador)
        this.marker = [0, 0];
        // Número de manos jugados
        this.number_hands_played = 0;
        // Indica el último ganador
        this.last_winner = null;
        // elegimos que jugador empieza la partida
        this.start();
    }
    // Añadir a los juegadores de este juego
    add_player(player){
        this.list_players.push(player);
        // devuelve la posicion del jugador dentro del juego
        return this.list_players.length - 1;
    }

    giveme_cards(){
        /*
        se eligen las cartas aleatoriamente de las cartas disponibles en el juego 
        //y se las devuelvo al jugador
        */
        return this.list_cards.splice(0, config.Config.NUM_CARDS_BY_MATCH / 2);
    }

    //Para saber que jugador empezará la partida
    start(){
        // elegir aleatoriamente una posicion del listado de player
        this.next_player = helpers.between(0, 1);
    }
    //te toca
    your_turn(position_in_game){
        if (this.number_hands_played < 4){
            // Añadimos la lógica del bot:
            // si el turno es el del bot, le vamos a decir que tire una carta
            // Vamos a averiguar si el otro jugador es un bot
            // console.log(60, this.next_player, position_in_game);
            if (this.next_player != position_in_game){
                // Si no me toca, pero el rival es un bot, entoces tiene que tirar el primero
                // usamos XOR para calcular la posicion del rival
                let position_rival = position_in_game ^ true;
                let rival = this.list_players[position_rival];
                if (rival.is_bot) {
                    // ya sabemos que el rival es un bot
                     // ver esta linea....
                    rival.toss_card(rival.list_cards[this.number_hands_played].id);
                }
            }
            return this.next_player == position_in_game;
        }else{
            return false;
        }
        
    }
    //tirada
    toss(card) {
        if (this.number_hands_played < config.Config.NUM_CARDS_BY_MATCH / 2){
            //El jugador ha elegido una carta y la tira sobre la mesa
            this.game_hand[this.next_player] = card;
            // usamos XOR para pasar desde la posición 0 a la posición 1
            // https://es.wikipedia.org/wiki/Puerta_XOR
            // si permitiéramos jugar con más de 2 jugadores, 
            // tendríamos que aplicar lógica para determinar cuando se sale del rango del array 
            // y colocarlo en la posición 0
            this.next_player ^= true;
            // LOGICA DEL BOT
           // Averiguamos si el rival es un bot
            let rival = this.list_players[this.next_player];
            
            // Si es un bot y no ha tirado todavia esta mano, entoces le toca tirar
            if (rival.is_bot && this.game_hand[this.next_player] == null) {
                // ya sabemos que el rival es un bot
                    rival.toss_card(rival.list_cards[this.number_hands_played].id);
            }else{
                // Hay que preguntar si se ha terminado la mano y calcular quien ha ganado
                // para saber si ha termiando la mano en la variable game_hand no puede haber un null
                // preuntamos ¿hay algún null?, find, filter
                //con find te devuelve undefined, es más óptimo
                let finish_hand = this.game_hand.find(num => num == null);
                //Si encuentra undefined habrá terminado la mano y llama a calculate_game_hand 
                //para calcular los puntos
                if (finish_hand === undefined){
                    this.calculate_game_hand();
                }
            }
            
            /* Lo mismo que lo anterior
            if (this.game_hand[0] !== null && this.game_hand[1] !== null){
                this.calculate_game_hand();
            }*/
        }
    }
    //Calcular por cada tirada (mano) quien ha ganado
    calculate_game_hand(){
        // - Determinar que carta guardada en la lista game_hand tiene mayor valor
        //   e indicar quien ha ganado la mano

        // Cogemos los puntos de cada una de las cartas guardadas
        let player_point_1 = parseInt(this.game_hand[0].point);
        let player_point_2 = parseInt(this.game_hand[1].point);
        
        // Número de mano que estamos jugando
        let hand = this.number_hands_played;

        // Guardo la información de las cartas usadas para poder consultarlas
        this.info_game_hand[hand] = {
            'cards': [this.game_hand[0], this.game_hand[1]],  // cartas usadas en la mano
            'winner': null,         // posición del jugador que ha ganado, -1 si ha empatado
        };
        
        if (player_point_1 > player_point_2){
            let diff = player_point_1 - player_point_2;
            //Actualizo marker
            this.marker[0] += diff;
            this.info_game_hand[hand]['winner'] = 0;
            // si ha ganado la partida empieza el jugador 1 (posicion 0)
            this.next_player = 0;
        }else if (player_point_1 < player_point_2){
            let diff = player_point_2 - player_point_1;
            //Actualizo marker
            this.marker[1] += diff;
            this.info_game_hand[hand]['winner'] = 1;
            // si ha ganado la partida empieza el jugador 2 (posicion 1)
            this.next_player = 1;
        }else{
            // si empatan no hubo ganador
            this.info_game_hand[hand]['winner'] = -1;
            // el siguiente en tirar será el mismo que en la mano anterior
        }

        // Quitar las cartas de la mesa (iniciar a null)
        this.game_hand[0] = null;
        this.game_hand[1] = null;
        // - Contador de número de manos
        this.number_hands_played++;
    }
    get_card_rival_for_hand(position_in_game){
        // devuelve la carta usada por el rival en la mano actual

        // usamos XOR para calcular la posicion del rival
        let position_rival = position_in_game ^ true;
        return this.game_hand[position_rival];
    }

    have_win_hand(position_in_game, hand){
        /*
        Esto responde 4 casos:
            - espera que no ha terminado la mano -> undefined
            - has gandado la mano -> 1
            - has perdido la mano -> 0
            - se ha empatado la mano -> -1
        */
        if (this.info_game_hand[hand] === undefined){
            // la mano no ha terminado
            return undefined;
        }else{
            // la mano ha terminado
            if (this.info_game_hand[hand]['winner'] == -1){
                // ha empatado
                return -1;
            }else{
                // forzamos que sea un número
                // para saber quien ha ganado, debe coincidir el ganador con la posición del jugador en el juego

                // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
                return this.info_game_hand[hand]['winner'] == position_in_game ? 1 : 0;
            }
        }

    }

    continue_playing(){
        return this.number_hands_played < 4;
    }

    end() {
        this.number_hands_played++;
    }

    get_info_rival(position_in_game){
        // usamos XOR para calcular la posicion del rival
        let position_rival = position_in_game ^ true;
        let rival = this.list_players[position_rival];
        //Pasamos las cartas ocultas
        return rival.get_info(cards_hidden=false);
    }

    get_marker(position_in_game){
        return {
            player: this.marker[position_in_game],
            rival: this.marker[position_in_game ^ true]
        }
    }

    info_hand(hand, position_in_game){
        return {
            player: this.info_game_hand[hand]['cards'][position_in_game],
            rival: this.info_game_hand[hand]['cards'][position_in_game ^ true]
        }

    }

}

module.exports.Game = Game ;
