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
                    <button className="menu-button unactive">HOW TO PLAY</button>
                    <button className="menu-button unactive">AUTHOR</button>
                </div>
            )
        }
    }
}


export { Menu }