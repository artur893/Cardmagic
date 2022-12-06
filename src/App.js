import React, { Component } from "react";
import './App.css'
import { Menu } from "./components/Menu";
import { Header } from "./components/Header";
import { HeroPick } from './components/HeroPick'
import { heroes } from "./components/heroesData";
import { cardsOne, cardsTwo } from "./components/cardsData"
import { GameBoard } from "./components/GameBoard";

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeView: 'menu',
            heroes: heroes,
            cardsPlayerTwo: cardsTwo,
            cardsPlayerOne: cardsOne
        }

        this.pickHero = this.pickHero.bind(this)
        this.setActiveView = this.setActiveView.bind(this)
    }

    setActiveView(value) {
        this.setState({activeView: value})
    }

    componentDidUpdate() {
        if (this.state.playerOne && this.state.playerTwo && !this.state.isHeroesPicked) {
            this.setState({ isHeroesPicked: true })
        }
    }

    pickHero(hero) {
        if (!this.state.playerOne) {
            const playerOne = hero
            playerOne['cards'] = this.state.cardsPlayerOne
            playerOne['onTable'] = new Array(6).fill(null)
            this.setState({ playerOne: playerOne })
        } else if (this.state.playerOne) {
            const playerTwo = hero
            playerTwo['cards'] = this.state.cardsPlayerTwo
            playerTwo['onTable'] = new Array(6).fill(null)
            this.setState({ playerTwo: playerTwo })
        }
    }

    render() {
        return (
            <>
                <Header />
                <div className="game-container">
                    <Menu activeView={this.state.activeView} setActiveView={this.setActiveView} />
                    <HeroPick activeView={this.state.activeView} heroes={this.state.heroes} pickHero={this.pickHero} isHeroesPicked={this.state.isHeroesPicked} />
                    <GameBoard isHeroesPicked={this.state.isHeroesPicked} players={[this.state.playerOne, this.state.playerTwo]} cards={this.state.cards} />
                </div>
            </>
        )

    }
}

export default App 