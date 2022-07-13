import React from 'react';

export default class Logo extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col">
                    <img className="mb-4" src="/images/logo.png" alt="Logo Poke Cards" />
                    <h1 className="h3 mb-3 fw-normal">Poke Cards</h1>
                </div>
            </div>
        )
    }
}
