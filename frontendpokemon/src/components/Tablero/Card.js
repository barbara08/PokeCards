import { useState, useEffect } from "react";
import {Config} from './config.js'

//Creamos la funcion y pasamos todos los parámetros (funciones creados en Tablero.js)
function Card({empty, id, name, imagen, point, index, block_cards, status_from_card, 
    block_cards_from_card, hand_from_card, toss_card_player_from_card, highlight}){
  
    //Creamos el estado de la carta para saber si ha sido usada o no
    const [used_cards, setUsedCards] = useState(false); // nos indica si la carta ha sido usada

    //Función para tirar la carta (se ejecutará en el Onclick)
    function toss_card(e){
        /*
            - Cuando el usuario haga click sobre una carta
            enviamos la carta al servidor para indicarselo (endPoint)
            - Si ha ido todo correcto, tenemos que bloquear los click 
            para que no pueda volver a echar esa carta
            del player y del rival
        */

        e.preventDefault();
        //Si la carta NO está bloqueda y NO es usada 
        if(!block_cards && !used_cards){
            // el estado de la carta (setUsedCards) cambia a true
            setUsedCards(true);
            // indicar al padre (Tablero) que se debe bloquear todas las cartas
            block_cards_from_card(true);
            /*
             Indicamos al padre (Tablero) la informacion neecesaria para que pinte
             la carta del jugador que se va a pintar en el centro del tablero
             */
            toss_card_player_from_card({
                'name': name,
                'image': imagen,
                'point': point
            });
            // Creamos la variable para guardar la URL 
            // URL dirección donde vamos a solicitar la petición al back
            let url = Config.URL + "/toss_card";
            fetch(url, {
                headers: {
                    // Pasamos la session
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('session')
                },
                method: "POST",
                body: JSON.stringify({
                    card_id: id
                })
            })
            .then((response) => response.json())
            .then((response) => {
                // Si la respuesta es 1 ha ido todo bien
                if (response.status == 1){
                    // Actualizo el estado de la mano que esta en el padre (Tablero)
                    hand_from_card(response.hand);
                    // Notifico al padre que cambie de estado, Estado STATUS_HAVEWIN también se actualiza
                    status_from_card(Config.STATUS_HAVEWIN);
                }else{
                    alert(response.message);
                }
            });
        }
    };

    if (empty == "true"){
        /*
        Vamos a pintar las cartas del centro del tablero
        */

        // Dependiendo del estado highlight (lo modifica el Tablero) añadimos un estilo css
        let card_win = highlight==(index - 1) ? 'card_win' : '';
        return (
            <div className={"card card_emtpy " + card_win} key={"card_empty_" + index}>
                <p className="card_name">{name}</p>
                <p className="card_point">{point}</p>
                <div className="card_image">
                    <img src={imagen} width="130px" />
                </div>
                <div className="pokecards card_player">
                    PokeCards
                </div>
            </div>
        )
    }

    // Defino las variables
    let add_class = "";
    let disable_class = "";
    //Si la carta está usada o está bloqueda cambiará el estilo (css)
    if (used_cards || block_cards){
        disable_class = "card_disabled";
    }else{
        //Si no está bloqueada cambio estilo a cursor para que podemos seleccionar la carta
        if (!block_cards){
            add_class = "cursor_pointer";
        }
    }
    /*
    Pintamos las cartas que le ha tocado a cada jugador
    */
    return (
        <>
            <div className={"player card card" + 
                            index + " " + 
                            disable_class + " " + 
                            add_class} 
                            key={"card_" + id} 
                            onClick={toss_card}>
                <p className="card_name">{name}</p>
                <p className="card_point">{point}</p>
                <div className="card_image">
                    <img src={imagen} width="110px" />
                </div>
                <div className="pokecards card_player">
                    PokeCards
                </div>
            </div>
        </>
    )
   
}

function CardHidden({index}) {
    /*
    Pintamos las cartas del rival, no tienen funcionalidad
    */
    return (
        <div className={"rival_card card" + index}>
            <div className="card_hidden pokecards">
                PokeCards
            </div>
        </div>
    )
}

// valor por defecto de las Card
const CARD_EMPTY_VALUE_INIT = {name:"", image:"", point: 0};

export {Card, CardHidden, CARD_EMPTY_VALUE_INIT}
