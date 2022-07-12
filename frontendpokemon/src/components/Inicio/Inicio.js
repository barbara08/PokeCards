import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import logo_play from './images/controller.svg';

export default function Iniciar(handleDataForm) {
    //Creamos estado para el nick
    const [nick, setNick] = useState("");

    //Creamos estado para el mensaje
    const [message, setMessage] = useState("");

    // Declaramos una variable para guardar Navegación, 
    // redirigir la pg Inicio hacia tablero de juego
    let navigate = useNavigate();

    // Creamos la funcion para guardar la información
    let handleSubmit = async (e) => {
        // Parar el efecto por defecto del form, no hace el submit hacia el action del form
        e.preventDefault();
        //Validación del Nick, no puede estar vacío
        if (nick === ''){
            setMessage("Pon un nick para poder jugar");
            return 0;
        }

        try {
            //Haremos fetch para actuarlizar el recurso al servidor (back)
            //cuando le demos al botón Play
            /*
            Llamada al endPont play cuando le demos al botón play!,
            le pasamos el nick para que genere el jugador
            */
            let res = await fetch("http://localhost:3001/play", {
                headers: {
                    'Content-type': 'application/json'
                },
                //con el método POST ya que se actualizará el Nick
                method: "POST",
                body: JSON.stringify({
                    nick: nick,
                })
            });
            /*
            Recogemos la respuesta del fetch donde debería de llegarnos el token de sesión
            */
            let resJson = await res.json();
            //Si el resultado de la respuesta es 200 (ok) asignamos una sesión para ese Nick
            if (res.status === 200) {
                sessionStorage.setItem('session', resJson.accessToken)
                setMessage("User created successfully");

                // redirect a tablero de juego (Tablero.js)
                navigate('/tablero_de_juego');
            } else if (res.status === 400) {
                setMessage(resJson.message);
            } else {
                setMessage("Some error occured");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={ handleSubmit }>

            <div className="row">
                <div className="col-sm-12 g-3">
                    <div className="form-floating">
                        <input
                            type="text"
                            value={nick}
                            onChange={(e) => {setNick(e.target.value); setMessage('')}}
                            className="form-control"
                            id="floatingInput"
                            placeholder="Your nick"
                        />
                        <label className="form-label" htmlFor="floatingInput">Enter your nick</label>
                        <div className="message_error">{message ? <p>{message}</p> : ''}</div>
                    </div>
                </div>
                <div className="col-sm-12 g-3">
                    <div className="form-floating">
                        <button 
                            className="w-100 btn btn-lg btn-warning btn-play"
                            type="submit">
                                <img src={logo_play} width="16px" alt="logo play" /> Play!
                        </button>
                    </div>
                </div>


            </div>
        </form>
    );
}
