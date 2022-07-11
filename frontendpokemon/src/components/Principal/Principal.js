import React from 'react';

import Myname from "../Myname/Myname";
import Rrss from "../Rrss/Rrss";
import Logo from "../Logo/Logo";
import Iniciar from "../Inicio/Inicio";
import Rules from "../Rules/Rules";

export default class Principal extends React.Component {

    render() {
        return (
            <main className="form-signin w-100 m-auto">
                <Logo />

                <Iniciar />
                <Rules />

                <div className="row">
                    <div className="col">
                        <Myname />
                        <Rrss />
                    </div>
                </div>
            </main>
        )
    }
}
