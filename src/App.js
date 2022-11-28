import React, { Component } from "react";
import './App.css'
import { Header } from "./components/Header";
import { HeroPick } from './components/HeroPick'
import { heroes } from "./components/heroesData";
import { cards } from "./components/cardsData"
import { GameBoard } from "./components/GameBoard";

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
            const playerOne = hero
            playerOne['cards'] = this.state.cards
            this.setState({ playerOne: playerOne })
        } else if (this.state.playerOne) {
            const playerTwo = hero
            playerTwo['cards'] = this.state.cards
            this.setState({ playerTwo: playerTwo })
        }
    }

    render() {
        return (
            <>
                <Header />
                <div className="game-container">
                    <HeroPick heroes={this.state.heroes} pickHero={this.pickHero} isHeroesPicked={this.state.isHeroesPicked} />
                    <GameBoard isHeroesPicked={this.state.isHeroesPicked} players={[this.state.playerOne, this.state.playerTwo]} cards={this.state.cards} />
                </div>
            </>
        )

    }
}

export default App 