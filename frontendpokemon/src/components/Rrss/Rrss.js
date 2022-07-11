import React from 'react';
import logo_linkedin from './images/linkedin.svg';
import logo_github from './images/github.svg';

export default class Rrss extends React.Component {
    render() {
        return (
            <ul className="list-inline">
                <li className="list-inline-item">
                    <a href="https://es.linkedin.com/in/barbaramb" target="_blank" className="text-decoration-none" title="BarbaraMB" rel="noreferrer">
                        <img src={logo_linkedin} alt="LinkedIn Barbara" />
                    </a>
                </li>
                <li className="list-inline-item">
                    <a href="https://github.com/barbara08" target="_blank" className="text-decoration-none" title="Barbara08" rel="noreferrer">
                        <img src={logo_github} alt="Github Barbara08" />
                    </a>
                </li>
            </ul>
        )
    }
}
