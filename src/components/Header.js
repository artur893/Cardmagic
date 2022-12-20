import { Component } from "react";
import './Header.css'

class Header extends Component {
    render() {
        if(this.props.activeView === 'menu' || this.props.activeView === 'heroPick')
        return (
            <header>
                CardMagic
            </header>)
    }
}

export { Header }