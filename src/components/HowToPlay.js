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
                        {basicsText}
                    </div>
                </div>
            )
        }
    }
}

export { HowToPlay }