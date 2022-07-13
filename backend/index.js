// modulos de node
const express = require("express");
const jwt = require('jsonwebtoken');        // para el token de session
//const bodyParser = require('body-parser');
const cors = require('cors');               // para aceptar el cors
const requestIp = require('request-ip');        // librería para saber la ip del cliente
//const cookieParser = require("cookie-parser");  // usar las cookie
//const sessions = require('express-session');    // usar las sesiones
const mariadb = require('mariadb');


// modulos propios del juego
const card_library = require("./card.js");  // libreria de cartas
const game_library = require("./game.js");  // libreria del juego
const player_library = require("./player.js");  // libreria del jugadorimport {Config} from './config.js'
const config = require('./config');
const helpers = require('./helpers');


// configuración del servidor
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'         // configuración del cors para que acepte peticiones desde cualquier ip o host
}));
//app.use(bodyParser.json());

//app.use(express.urlencoded({ extended: true }));

//serving public file
//app.use(express.static(__dirname));

// cookie parser middleware
//app.use(cookieParser());


// Arranco el 'servicio' para adquirir las cartas y tener las cartas siempre disponibles
// las cartas están guardadas en memoria
const cards = new card_library.Cards();
// cards.show_all_cards();
/*

// Empezamos un juego
const game = new game_library.Game(cards);
console.log(game);
*/

// diccionario de jugadores
let players = {};

function get_name_bot(){
    let name_bot = ["Ana", "Pepe", "Juan", "Lucía", "Erika", "Carmen", "Carlos", "Rodolfo"];
    let pos_name_bot = helpers.between(0, name_bot.length - 1);
    return name_bot[pos_name_bot];;
}


// middleware -> mirar whatsapp
// los codigos 401 y 403 son códigos estandar de http
const authenticateJWT = (request, response, next) => {
    // Coger la autorización del headers 
    const authHeader = request.headers.authorization;

    if (authHeader) {
        // Coger token de la autorización 
        const token = authHeader.split(' ')[1];
        // verificar el token sea correcto
        jwt.verify(token, config.Config.ACCESSTOKENSECRET, (err, user) => {
            if (err) {
                // Si no se verifica el token devolvemos 403 forbidden
                return response.sendStatus(403);
            }
            /* En la variable user tenemos la información que hemos guardado 
            //cuando hemos generado el token
             {nick: ..., id: ..., ip: ...}
             */
            // verificar que el id del player sigue existiendo en el diccionario players
            if(players[user.id] === undefined){
                console.log("player no esta en playres")
                return response.sendStatus(403);
            }

            // Guardamos la variable user en request para tenerla accesible
            request.user = user;
            next();
        });
    } else {
        // si no recibimos la autorización devolvemos error 401 NO AUTORIZADO
        response.sendStatus(401);
    }
};

// prueba
app.get('/', (req, res) => {
  res.send("GET Request Called")
});
//

app.post('/play', (request, response) => {
    /*
    Se llama a este endPoint cuando el usuario se loguea (frontend)
    recogemos la ip del usuario, generamos el jugador y el juego
    guardamos el jugador en la lista de jugadores
    generamos y devolver el token que deberá de enviarnos para validar la sesión
    */
    // get ip user
    let user_ip = requestIp.getClientIp(request);
    // get data recibido
    let data = {nick: request.body.nick};

    // validamos que el nick no venga vaćío
    if (data['nick'] === undefined || data['nick'] === ''){
        response.status(400).json({"message": "El nick viene vacío"});
    }

    // buscar un juego libre o crearlo
    let game = new game_library.Game(cards);
    // creacion del jugador
    let player = new player_library.Player(data.nick, user_ip, game);

    let bot = new player_library.Player(get_name_bot(), user_ip, game, true);

    // generamos la sesión del usuario guardando el id de player
    //j wt.sign se genera el token
    const accessToken = jwt.sign(
        { nick: player.nick,  id: player.id, ip: user_ip}, 
        config.Config.ACCESSTOKENSECRET
    );
    // guardamos el jugador en la lista de jugadores
    players[player.id] = player;

    response.json({
        accessToken
    });
});

app.get('/info_game', authenticateJWT, (request, response) => {

    let player_info = request.user;
    let player = players[player_info.id];

    if(request.headers['x-pkcrd'] == 1){
        let game = new game_library.Game(cards);
        player.change_game(game);
        let bot = new player_library.Player(get_name_bot(), "", game, true);
    }

    result = JSON.stringify({
        'player': player.get_info(cards_hidden=false),
        'rival': player.get_rival(),
        'marker': player.get_marker(),
        'continue': player.continue_playing()
    });
    // setTimeout(() => response.send(result), 10000);
    response.send(result);
});


//INICIO LOGOUT
app.get('/logout', authenticateJWT, (request, response) => {

    // elimina la sessión player del diccionario players {id, nick}
    // return {}
    //lo he hecho con app.delete
});
// para cerrar la sesión
app.delete('/logout/', authenticateJWT, (request, response) => {
    let logout = request.user
    if(players[user.id] === undefined){
        //response.
    }
    
});
//FIN LOGOUT

//INICIO METOCA
app.get('/my_turn', authenticateJWT, (request, response) => {
    // preguntar al juego si le toca jugar al jugador
    // return {tetoca: false, timeout: 20 (segundo)}
    let player_info = request.user;
    if(players[player_info.id] === undefined){
        response.send({'error': '001', 'message': 'Closed session'});
    }else{
        let player = players[player_info.id];
        let result = {
            "your_turn": player.my_turn(),
            "rival_cards": player.rival_cards_hand(),
            "timeout": 20   // pendiente de definir como calcularlo
        };
        response.json(result);
    }
});

//FIN METOCA

//INICIO HEGANADO LA MANO //calculate_game_hand()
app.post('/have_win', authenticateJWT, (request, response) => {
    // preguntar si ha gandado la mano
    /*
        return {
            gandao: true,   // si el jugador ha gandado la mano
            marcador: [mardaor_jugador1, marcador_jugador2,    // el nuevo marcador
            continue: false]} // si continuamos jungando
        }
    */
    let player_info = request.user;
    // cojo información del jugador
    let player = players[player_info.id];

    // la mano que estamos averiguando si hemos ganado la recogemos de los parametros recibidos
    let hand = request.body.hand;
    /*
        FALTA QUE DEVUELVA LA INFORMACIÓN DE LAS CARTAS QUE SE HAN USADO EN LA MANO PARA PINTARLAS
    */
    let result = player.am_i_winner(hand);
    response.send(result);

});
//FIN HEGANADO LA MANO

//INICIO TIRAR CARTA
app.post('/toss_card', authenticateJWT, (request, response) => {
    // el player indica que carta ha tirado
    // verificar que el id de la carta recibida esta en su listado de cartas (en la clase player)
    let player_info = request.user;
    let player = players[player_info.id];
    let card_id = request.body.card_id;
    console.log("Carta recibida", card_id);
    let num_hand = player.toss_card(card_id);

    let result = {
        'status': num_hand === false ? 0 : 1,
        'message': num_hand === false ? 'Card invalid' : null,
        'hand': num_hand === false ? null : num_hand
    };

    response.send(result);

    /* return {
        tirado: true/false,
        timeout: 60 (segundos) // tiempo de espera para que el otro jugador decida que carta tirar
    }*/
});

app.get('/ranking', (request, response) => {
    // conectarse a bbdd y devolver los 10 mejores
    let query = "SELECT * FROM `ranking` ORDER BY partidas_ganadas DESC, puntos_ganados DESC, partidas_empatadas DESC, partidas_perdidas DESC, puntos_perdidos DESC LIMIT 10;"

    helpers.pool_connections.getConnection().then(conn => {

        conn.query(query).then((rows) => {
            response.json(rows);
            // close connection
            conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err);
          conn.end();
        })
    }).catch(err => {
      //not connected
    });

});


/*
para cuando usemos el servidor

*/
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

