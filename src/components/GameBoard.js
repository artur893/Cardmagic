import { Component } from "react";
import './GameBoard.css'
import { cloneDeep } from 'lodash';

class GameBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            numberOfRound: 1,
            playerOne: null,
            playerTwo: null
        }

        this.nextRound = this.nextRound.bind(this)
        this.addTotalMana = this.addTotalMana.bind(this)
        this.gameControl = this.gameControl.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                playerOne: this.props.players[0],
                playerTwo: this.props.players[1]
            })
        }
    }

    async gameControl() {
        await this.nextRound()
        this.addTotalMana()
    }

    async nextRound() {
        let round = this.state.numberOfRound
        round += 0.5
        this.setState({ numberOfRound: round })
    }

    addTotalMana() {
        console.log(this.state.numberOfRound)
        console.log(Number.isInteger(this.state.numberOfRound))
        if (Number.isInteger(this.state.numberOfRound)) {
            const playerOne = cloneDeep(this.state.playerOne)
            playerOne['totalMana'] = playerOne.totalMana + 1
            playerOne['mana'] = playerOne.totalMana
            const playerTwo = cloneDeep(this.state.playerTwo)
            playerTwo['totalMana'] = playerTwo.totalMana + 1
            playerTwo['mana'] = playerTwo.totalMana
            this.setState({
                playerOne: playerOne,
                playerTwo: playerTwo
            })
        }
    }

    render() {
        if (this.props.isHeroesPicked)
            return (
                <>
                    <button onClick={this.gameControl}>NEXT ROUND</button>
                    <Player hero={this.state.playerOne} />
                    <Player hero={this.state.playerTwo} />
                </>
            )
    }
}

class Player extends Component {
    render() {
        return (
            <div className="player">
                <div className="player-name">{this.props.hero.name}</div>
                <div className="player-hp">{this.props.hero.hp}</div>
                <div className="player-mana">{this.props.hero.mana}</div>
            </div>
        )
    }
}

export { GameBoard }