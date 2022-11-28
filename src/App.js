import React, { Component } from "react";
import './App.css'
import { Header } from "./components/Header";
import { HeroPick } from './components/HeroPick'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            heroes: [{
                name: 'Wojownik',
                hp: 30,
                skillName: 'Szarża',
                skillText: 'Zadaj 2pkt obrażeń',
                skill: 'method here'
            }, {
                name: 'Czarodziej',
                hp: 30,
                skillName: 'Omam',
                skillText: 'Przejmij kontrolę nad wrogim stronnikiem',
                skill: 'method here'
            }, {
                name: 'Mnich',
                hp: 30,
                skillName: 'Medytuj',
                skillText: 'Dodaj sobie +1 maksymalnej many',
                skill: 'method here'
            }, {
                name: 'Wampir',
                hp: 30,
                skillName: 'Ugryź',
                skillText: 'Zadaj 1pkt obrażeń, ulecz 1hp',
                skill: 'method here'
            }],
            cards: [{
                name: 'Garbaty Goblin',
                attack: 1,
                hp: 1,
                cost: 1,
                skill: null
            }]
        }
    }

    render() {
        return (
            <div className="game-container">
                <Header />
                <HeroPick heroes={this.state.heroes}/>
            </div>)

    }
}

export default App 