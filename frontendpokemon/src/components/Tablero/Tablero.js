/*
https://es.reactjs.org/docs/faq-functions.html
https://es.reactjs.org/docs/components-and-props.html
*/

// Los css las defino en pokecards_tablero.css

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import Point from './Point';
import Nick from './Nick';
import Rules from "../Rules/Rules";
import Ranking from "../Ranking/Ranking";

import {Card, CardHidden, CARD_EMPTY_VALUE_INIT} from './Card';
import {Config} from './config.js'

import Myname from "../Myname/Myname";
import Rrss from "../Rrss/Rrss";

export default function Tablero() {
    const [isLoading, setIsLoading] = useState(true);
   
    // Cuando carga la vista por primera vez rival, player son null, 
    // con marker NO es array por lo que no dará problemas
    // Creamos los estados e iniciamos a null
    const [rival, setRival] = useState(null);
    const [marker, setMarker] = useState(null);
    const [player, setPlayer] = useState(null);
    const [hand, setHand] = useState(null);

    // Creamos el estado para coger información de la carta del player cuando haga click 
    // para mostrarlo en el centro del tablero   en useState le pasamos los datos que se actualizarán
    const[toss_card_player, setTossCardPlayer] = useState(CARD_EMPTY_VALUE_INIT);
    
    // Creamos el estado para coger información de la carta del rival cuando haga click 
    // para mostrarlo en el centro del tablero
    const[toss_card_rival, setTossCardRival]= useState(CARD_EMPTY_VALUE_INIT);
    
    //Las const que usaremos en el return
    // const [end_game, setEndGame] = useState(false); // nos indica que ha terminado el juego
    const [status, setStatus] = useState(Config.STATUS_MYTURN); // estado en el que se encuentra el jugador (0,1,2,3) lo inicamos a STATUS_MYTURN
    const [block_cards, setBlockCards] = useState (true); // nos indica si están los click de la carta bloquado

    // mensaje informativo sobre el resultado de la mano
    const [message_info, setMessageInfo] = useState('');
    // indica que carta ha ganado, lo usamos para destacar la carta
    const [card_win, setCardWin] = useState(-1);

    // Declaramos una variable para guardar Navegación, 
    // redirigir la pg tablero de juego hacia Inicio 
    let navigate = useNavigate();
    
    // pedimios informacion del juego
    const getData = (new_game=false) => {
        let url = Config.URL + "/info_game";

        if (new_game){
            // como voy a crear un nuevo juego, activo el loading
            setIsLoading(true);
        }
        // await fetch(url, {
        fetch(url, {
            headers: {
                //Le decimos si es el mismo jugador y la misma sesión
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('session'),
                // añado una nueva cabecera para indicar al backend si es un nuevo juego o si es la recarga de un juego existente
                'X-Pkcrd': new_game===true ? 1 : 0
            },
            method: "GET"
        })
        .then((response) => response.json())
        .then((response) => {
            // console.log(sessionStorage.getItem('session'));
            // Actualizar los estados del rival, player y marker
            setRival(response.rival);
            setPlayer(response.player);
            setMarker(response.marker);
            setIsLoading(false);
            //Si no continua el game (ha terminado la partida)
            if (response.continue === false){
                //1. Actualizo cuando ha terminado la mano
                setStatus(Config.STATUS_FINISH);
                //2. Al estado setEndGame le decimos que ha terminado (true)
                // setEndGame(true);
            }else{
                if (new_game){
                    setStatus(Config.STATUS_MYTURN);
                    setBlockCards(true);
                }
            }
        })
        .catch(err => console.log(err))
    };
    // hacemos la llamada para pedir la información del juego cuando se carga la página
    useEffect(() => {
        getData(false);
    }, []);
       /*
    Los siguietes const son funciones que le pasamos a Card (hijo) 
    para que actualice los estados de Tablero (padre)
    (se pasa como paráametro en Card.js)
    */
    const status_from_card = (new_status) => {
        setStatus(new_status);
    };
    const block_cards_from_card = (new_block) => {
        setBlockCards(new_block);
    };
    const hand_from_card = (new_hand) => {
        console.log("hand_from_card", new_hand);
        setHand(new_hand);
    };
    const toss_card_player_from_card = (new_toss_card_player) => {
        setTossCardPlayer(new_toss_card_player);
    };
    const toss_card_rival_from_card = (new_toss_card_rival) => {
        setTossCardRival(new_toss_card_rival);
    };

    function continueHand(e){
        /*
        poner los estado en los valores iniciales
         */
        e.preventDefault();
        setStatus(Config.STATUS_MYTURN);
        setTossCardPlayer(CARD_EMPTY_VALUE_INIT);
        setTossCardRival(CARD_EMPTY_VALUE_INIT);
        setCardWin(-1);
    }

    function playAgain(e){
        e.preventDefault();
        // carga informacion del juego, indicando que será un nuevo juego
        getData(true);
        continueHand(e);
    }

    useEffect(() => {
        // Si el estado es 0 (es mi turno) llamo al método my_turn (back)
        if (status === Config.STATUS_MYTURN){
            // Para poder echar una carta, el servidor nos tiene que dar permiso
            const getMyTurn = async () => {
                let url = Config.URL + "/my_turn";
    
                await fetch(url, {
                    //Le decimos si es el mismo jugador y la misma sesión)
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('session')
                    },
                    method: "GET"
                })
                .then((response) => response.json())
                .then((response) => {
                    //
                    if (response.error !== undefined) {
                        console.log(response);
                        alert(response.message);
                        // redireccion hacia el Inicio
                    }else{
                        if (response.your_turn){
                            setStatus(Config.STATUS_WAIT); 
                            setBlockCards(false);
                        }
                        if (response.rival_cards != null){
                            setTossCardRival(response.rival_cards);
                        }
                    }
                })
                .catch(err => console.log(err))
            };
            getMyTurn();
        }else if (status === Config.STATUS_HAVEWIN || status === Config.STATUS_HAVEWIN2){
            /*
            Esperaremos hasta que el servidor nos responda y nos indique que ha terminado la mano
            nos dirá si hemos ganado o perdido la mano
            nos actualizará el marcador
            nos indicará si ha terminado el juego
            */
            const getHaveWin = async () => {
                let url = Config.URL + "/have_win";
                console.log("STATUS_HAVEWIN", hand);
    
                await fetch(url, {
                    headers: {
                        //Le decimos si es el mismo jugador y la misma sesión
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('session')
                    },
                    method: "POST",
                    body: JSON.stringify({
                        'hand': hand
                    })
                })
                .then((response) => response.json())
                .then((response) => {
                    if (response.error !== undefined) {
                        console.log(response);
                        alert(response.message);
                        // redireccion hacia el login
                    }else{
                        if (response.wait) {
                            /*
                            if (status == Config.STATUS_HAVEWIN){
                                setStatus(Config.STATUS_HAVEWIN2);
                            }else{
                                setStatus(Config.STATUS_HAVEWIN);
                            }
                            setTimeout(function(){
                            alert("no ya mas" + status);
                                
                            }, 1000);
                            */
                        }else{
                            if (response.used_cards){
                                setTossCardRival(response.used_cards.rival);
                                setTossCardPlayer(response.used_cards.player);
                            }

                            // actualizo el marcador
                            setMarker(response.marker);
                            // compruebo si ha terminado el juego
                            if (response.continue === false){
                                setStatus(Config.STATUS_FINISH);
                                // montar el mensaje del resultado de la partida
                                if (response.marker.rival > response.marker.player){
                                    setMessageInfo(`Has perdido la partida`);
                                }else if (response.marker.rival < response.marker.player){
                                    setMessageInfo(`¡${player.nick} has ganado la partida!`);
                                }else{
                                    setMessageInfo(`Partida empatada`);
                                }
                                // setEndGame(true);
                            }else{
                                if (response.is_win === 1){
                                    setCardWin(1);
                                    setMessageInfo("¡Mano ganada!");
                                }else if (response.is_win === 0){
                                    setCardWin(0);
                                    setMessageInfo("Mano perdida");
                                }else{
                                    setCardWin(-1);
                                    setMessageInfo("Empate");
                                }
                                // muestro la información de la mano, hasta que no le de a continuar no pasa al siguiente estado
                                setStatus(Config.STATUS_SHOW_INFO_HAND);
                                /*
                                // paso al estado para saber si me toca tirar
                                setStatus(Config.STATUS_MYTURN);
                                */
                            }
                            // bloqueo las cartas
                            setBlockCards(true);
                        }
                    }
                })
                .catch(err => console.log(err))
            };
            getHaveWin();
        }
    }, [status]); // pasamos status para que vuelva a su estado inicial

    if (isLoading === true) {
        return (<p>Loading...</p>); // currarse el loading, hay que envolverlo en el return
    }

    // Prevenir la primera carga, hacer que si existe rival lo pinte
    return (
        <>
            <div className='container_tablero'>

                <Point key="point_rival" value={marker.rival}></Point>
                
                <CardHidden key="card_hidden1" index="1" />
                <CardHidden key="card_hidden2" index="2" />
                <CardHidden key="card_hidden3" index="3" />
                <CardHidden key="card_hidden4" index="4" />
        
                <Nick key="nick_rival" name={rival.nick}></Nick>
                
                <div className="card_empty_container card_empty1">
                    <Card empty="true" index="1" 
                            name={toss_card_rival.name}
                            imagen={toss_card_rival.image}
                            point={toss_card_rival.point}
                            highlight={card_win}></Card>
                </div>

                <div className="versus">
                    <p className="versus_title">
                        <img src="/images/vs.png" width="35px" alt="VS" />
                    </p>
                    <p className={status===Config.STATUS_WAIT ? '' : 'hidden'}>Tu Turno</p>
                    <div className={status===Config.STATUS_SHOW_INFO_HAND ? '' : 'hidden'}>
                        <p className="message_info">{message_info}</p>
                        
                        <button className="btn btn-dark btn-continue" onClick={continueHand}>
                            Continue
                        </button>
                    </div>
                    <div className={status===Config.STATUS_FINISH ? '' : 'hidden'}>
                        <p className="message_info_end_game">{message_info}</p>
                        <button className="btn btn-dark btn-playagain" onClick={playAgain}>
                            <img src="/images/controller.svg" width="24px" alt="logo play" />
                            Jugar de nuevo
                        </button>
                    </div>
                </div>
            
                <div className="card_empty_container card_empty2">
                    <Card empty="true" index="2"
                            name={toss_card_player.name}
                            imagen={toss_card_player.image}
                            point={toss_card_player.point}
                            highlight={card_win}></Card>
                </div>
                
                

                <Point key="my_point" value={marker.player} class_custom="player"></Point>

                {player.cards.map(function(card, i){
                    let index = i + 1;
                    return (
                        <Card
                            key={card.id}
                            empty="false"
                            id={card.id}
                            name={card.name}
                            imagen={card.image}
                            point={card.point}
                            block_cards={block_cards}
                            status_from_card={status_from_card}
                            block_cards_from_card={block_cards_from_card}
                            hand_from_card={hand_from_card}
                            toss_card_player_from_card={toss_card_player_from_card}
                            toss_card_rival_from_card={toss_card_rival_from_card}

                            index={index}>
                        </Card>
                    )
                })};
                
                <Nick key="my_nick" name={player.nick} class_custom="player"></Nick>

                <div className="footer myname">
                    <Myname />
                </div>
                <div className="footer rrss">
                    <Rrss />
                </div>
                <div className="footer menu_footer">
                    
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <button className="btn btn-dark btn-playagain" onClick={playAgain}>
                                <img src="/images/house.svg" width="20px" alt="Ir a la home" />
                            </button>
                        </li>
                        <li className="list-inline-item">
                            <Ranking size="sm" />
                        </li>
                        <li className="list-inline-item">
                            <Rules size="sm" />
                        </li>
                    </ul>
                </div>

            </div>


        </>
    )
}
