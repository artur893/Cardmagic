import { Component } from "react";
import './Menu.css'

class Menu extends Component {
    render() {
        if (this.props.activeView === 'menu') {
            return (
                <div className="menu">
                    <button className="menu-button" onClick={() => this.props.setActiveView('heroPick')}>SINGLEPLAYER</button>
                    <button className="menu-button unactive">HOT SEAT</button>
                    <button className="menu-button unactive">MULTIPLAYER</button>
                    <button className="menu-button" onClick={() => this.props.setActiveView('howToPlay')}>HOW TO PLAY</button>
                    <a href="https://github.com/artur893" className="menu-button">AUTHOR</a>
                </div>
            )
        }
    }
}

class BackToMenu extends Component {
    constructor(props) {
        super(props)

        this.disableGameMode = this.disableGameMode.bind(this)
    }

    disableGameMode() {
        const gameContainer = document.querySelector('.game-container')
        gameContainer.classList.remove('game-mode')
    }

    render() {
        return <button className="back-to-menu" onClick={() => {
            this.props.setActiveView('menu')
            this.props.cleanHeroes()
            this.disableGameMode()
        }}>Back to main menu</button>
    }
}

export { Menu, BackToMenu }