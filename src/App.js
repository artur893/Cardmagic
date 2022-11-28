import React, { Component } from "react";
import './App.css'
import { Header } from "./components/Header";
import { HeroPick } from './components/HeroPick'
import { heroes } from "./components/heroesData";
import { cards } from "./components/cardsData"

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            heroes: heroes,
            cards: cards
        }

        this.pickHero = this.pickHero.bind(this)
    }

    componentDidUpdate() {
        if (this.state.playerOne && this.state.playerTwo && !this.state.isHeroesPicked) {
            this.setState({ isHeroesPicked: true })
        }
    }

    pickHero(hero) {
        if (!this.state.playerOne) {
            this.setState({ playerOne: hero })
        } else if (this.state.playerOne) {
            this.setState({ playerTwo: hero })
        }
    }

    render() {
        return (
            <div className="game-container">
                <Header />
                <HeroPick heroes={this.state.heroes} pickHero={this.pickHero} isHeroesPicked={this.state.isHeroesPicked}/>
            </div>)

    }
}

export default App 