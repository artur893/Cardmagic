import React, { Component } from "react";
import './App.css'
import { BackToMenu, Menu } from "./components/Menu";
import { Header } from "./components/Header";
import { HeroPick } from './components/HeroPick'
import { heroes } from "./components/heroesData";
import { cardsOne, cardsTwo } from "./components/cardsData"
import { GameBoard } from "./components/GameBoard";
import { cloneDeep } from 'lodash';

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
        this.cleanHeroes = this.cleanHeroes.bind(this)
    }

    setActiveView(value) {
        this.setState({ activeView: value })
    }

    cleanHeroes() {
        this.setState({ isHeroesPicked: false, playerOne: null, playerTwo: null })
    }

    componentDidUpdate() {
        if (this.state.playerOne && this.state.playerTwo && !this.state.isHeroesPicked) {
            this.setState({ isHeroesPicked: true })
        }
    }

    pickHero(hero) {
        if (!this.state.playerOne) {
            const playerOne = cloneDeep(hero)
            playerOne['cards'] = this.state.cardsPlayerOne
            playerOne['onTable'] = new Array(6).fill(null)
            this.setState({ playerOne: playerOne })
        } else if (this.state.playerOne) {
            const playerTwo = cloneDeep(hero)
            playerTwo['cards'] = this.state.cardsPlayerTwo
            playerTwo['onTable'] = new Array(6).fill(null)
            this.setState({ playerTwo: playerTwo })
            this.setState({ activeView: 'gameBoard' })
        }
    }

    render() {
        return (
            <>
                <Header />
                <div className="game-container">
                    <Menu activeView={this.state.activeView} setActiveView={this.setActiveView} />
                    <HeroPick activeView={this.state.activeView} heroes={this.state.heroes} pickHero={this.pickHero} isHeroesPicked={this.state.isHeroesPicked} />
                    <GameBoard activeView={this.state.activeView} isHeroesPicked={this.state.isHeroesPicked}
                        players={[this.state.playerOne, this.state.playerTwo]} />
                    <BackToMenu setActiveView={this.setActiveView} cleanHeroes={this.cleanHeroes} />
                </div>
            </>
        )

    }
}

export default App 