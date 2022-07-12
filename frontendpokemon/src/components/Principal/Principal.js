import React from 'react';

import Myname from "../Myname/Myname";
import Rrss from "../Rrss/Rrss";
import Logo from "../Logo/Logo";
import Iniciar from "../Inicio/Inicio";
import Rules from "../Rules/Rules";
import Ranking from "../Ranking/Ranking";


export default class Principal extends React.Component {

    render() {
        return (
            <main className="form-signin w-100 m-auto">
                <Logo />

                     <Iniciar />
                    
                <div className="row">
                    <div className="col-sm-6 g-3">
                        <Ranking />
                            
                    </div>
                    <div className="col-sm-6 g-3">

                    <Rules />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 g-3">
                        <Myname />
                        <Rrss />
                    </div>
                </div>
            </main>
        )
    }
}
