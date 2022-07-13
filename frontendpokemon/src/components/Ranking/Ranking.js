import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {Config} from '../Tablero/config.js'

import logo_btn_ranking from './images/ranking-star-solid.svg';
import logo_medal from './images/medal-solid.svg';


export default function Ranking({size="lg"}) {
  const [ranking, setRanking] = useState(false);
  const [ranking_data, setRankingData] = useState([]);

  const handleClose = () => setRanking(false);
  const handleRanking = () => setRanking(true);

  // pedimios informacion del ranking del juego
  const getDataRanking = () => {
    let url = Config.URL + "/ranking";

    // await fetch(url, {
    fetch(url, {
        headers: {
            //Le decimos si es el mismo jugador y la misma sesión
            'Content-type': 'application/json',
        },
        method: "GET"
    })
    .then((response) => response.json())
    .then((response) => {
      setRankingData(response)
    })
    .catch(err => console.log(err))
  };
  // hacemos la llamada para pedir la información del juego cuando se carga la página
  useEffect(() => {
    getDataRanking();
  }, []);
  let style="btn btn-dark btn-playagain";
  let label_btn="";

  if (size === "lg"){
    style="w-100 btn btn-lg btn-warning";
    label_btn="Ranking";
  }

  return (
    <>
      <button className={style + " btn-rules"} type="button" onClick={handleRanking}>
        <img src={logo_btn_ranking} width="20px" alt="Logo ranking" /> {label_btn}
      </button>


      <Modal size="lg" show={ranking} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-modal_title">Ranking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-rules" key="table_ranking">
            <table className="table">
              <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nick</th>
                    <th scope="col">Partidas ganadas</th>
                    <th scope="col">Puntos ganados</th>
                    <th scope="col">Partidas empatadas</th>
                    <th scope="col">Partidas perdidas</th>
                    <th scope="col">Puntos perdidos</th>
                    <th scope="col">Partidas jugadas</th>
                  </tr>
              </thead>
              <tbody>
              
              {ranking_data.map(function(player, position){
                return (
                  <tr key={"row_ranking_" + position} className={position === 0 ? 'ranking_winner' : ''}>
                    <td>{position + 1}</td>
                    <td>{player.nick}</td>
                    <td>{player.partidas_ganadas}</td>
                    <td>{player.puntos_ganados}</td>
                    <td>{player.partidas_empatadas}</td>
                    <td>{player.partidas_perdidas}</td>
                    <td>{player.puntos_perdidos}</td>
                    <td>{player.partidas_jugadas}</td>
                  </tr>
                )
              })}

              </tbody>
            </table>
        

            

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-warning btn-play" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
//module.exports.Ranking = Ranking();

/*

                  <td>{player.nick}</td>
                  <td>{player.partidas_ganadas}</td>
                  <td>{player.puntos_ganados}</td>
                  <td>{player.partidas_empatadas}</td>
                  <td>{player.partidas_perdidas}</td>
                  <td>{player.puntos_perdidos}</td>
                  <td>{player.partidas_jugadas}</td>*/