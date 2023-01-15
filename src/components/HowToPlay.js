import { extend } from "lodash";
import { Component } from "react";
import './HowToPlay.css'
import { basicsText } from './howToPlayContent'

class HowToPlay extends Component {
    render() {
        if (this.props.activeView === 'howToPlay') {
            return (
                <div className="how-to-play-container">
                    <ul className="how-to-play-list">
                        <li>Basics</li>
                        <li>Heroes</li>
                        <li>First round</li>
                        <li>Gameflow</li>
                    </ul>
                    <div className="how-to-play-main">
                        <Basics />
                    </div>
                </div>
            )
        }
    }
}

class Basics extends Component {
    render() {
        return (
            <>
                <p>{basicsText.p1}</p>
                <p>{basicsText.p2}</p>
                <p>{basicsText.p3}</p>
            </>
        )
    }
}

export { HowToPlay }