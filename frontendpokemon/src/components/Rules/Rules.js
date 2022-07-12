import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import logo_rules from './images/file-earmark-text.svg';


export default function Rules() {
  const [rules, setRules] = useState(false);

  const handleClose = () => setRules(false);
  const handleRules = () => setRules(true);

  return (
    <>
      <button className="w-100 btn btn-lg btn-warning btn-rules" type="button" onClick={handleRules}>
        <img src={logo_rules} width="16px" alt="Logo rules" /> Rules
      </button>


      <Modal size="lg" show={rules} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-modal_title">Poke Card - Reglas del juego</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-rules">
            <p>Poke Card está diseñado para jugar de forma rápida,
              solo necesitará introducir un Nick y... a Jugar!</p>

            <p>El objetivo del juego: </p>
            <p>Conseguir la mayor puntuación posible.</p>

            <p>
              Para ello se repartirán 4 cartas para cada jugador (de forma aleatoria)

            </p>

            <p>
              Cada carta contiene:
              El nombre de Poke Card
              Su puntuación
              Su imágen
            </p>

            <p>
              Por cada mano cada jugador tirará una carta en su turno.
            </p>
            <p>
              Ganará la mano el jugador que tire la carta de mayor valor pero no significará que gane la partida.

            </p>
            <p>
              Ganará la partida el que obtenga mayor puntuación.

            </p>
            <p>
              Los puntos se obtiene por la diferecia de puntos de las cartas tiradas

            </p>

            <p>Para volver a jugar de nuevo solo tendrá que pinchar en Jugar de nuevo!</p>

            <p>Disfruta del juego!</p>

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
