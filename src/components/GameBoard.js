import { Component } from "react";
import './GameBoard.css'
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';

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
            if (this.props.isHeroesPicked) {
                this.initStartCards('playerOne')
                this.initStartCards('playerTwo')
            }
        }
    }

    initStartCards(player) {
        const playerClone = cloneDeep(this.state[player])
        const onHand = []
        for (let i = 0; i < 4; i++) {
            const random = Math.random() * (playerClone.cards.length - 1)
            const randomCard = playerClone.cards.splice(random.toFixed(0), 1)[0]
            onHand.push(randomCard)
        }
        playerClone['onHand'] = onHand
        this.setState({ [player]: playerClone })
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
        if (this.props.isHeroesPicked) {
            return (
                <>
                    <button onClick={this.gameControl}>NEXT ROUND</button>
                    <Player hero={this.state.playerOne} id='player-one' />
                    <Player hero={this.state.playerTwo} id='player-two' />
                    <OnHandCards hero={this.state.playerOne} isHeroesPicked={this.props.isHeroesPicked} id='player-one-cards' />
                    <OnHandCards hero={this.state.playerTwo} isHeroesPicked={this.props.isHeroesPicked} id='player-two-cards' />
                </>
            )
        }
    }
}

class Player extends Component {
    render() {
        return (
            <div className="player" id={this.props.id}>
                <div className="player-name">{this.props.hero.name}</div>
                <div className="player-hp">{this.props.hero.hp}</div>
                <div className="player-mana">{this.props.hero.mana}</div>
            </div>
        )
    }
}

class OnHandCards extends Component {
    constructor(props) {
        super(props)

        this.state = { isHeroDataLoaded: false }
    }

    componentDidMount() {
        this.setState({ isHeroDataLoaded: true })
        this.screenGameMode()
    }

    screenGameMode() {
        const gameContainer = document.querySelector('.game-container')
        gameContainer.classList.add('game-mode')
    }

    populateCards() {
        if (this.state.isHeroDataLoaded) {
            const onHand = this.props.hero.onHand.map((card) => {
                return (
                    <div className="onhand-card" key={uuid()}>
                        <div className="onhand-card-top">
                            <div className="onhand-name" key={uuid()}>{card.name}</div>
                            <div className="onhand-cost" key={uuid()}>{card.cost}</div>
                        </div>
                        <p className="onhand-description" key={uuid()}>{}</p>
                        <div className="onhand-card-bottom">
                            <div className="onhand-attack" key={uuid()}>{card.attack}</div>
                            <div className="onhand-hp" key={uuid()}>{card.hp}</div>
                        </div>
                    </div>)
            })
            return onHand
        }
    }

    render() {
        if (this.props.isHeroesPicked) {
            return (
                <div className="onhand-cards" id={this.props.id}>
                    {this.populateCards()}
                </div>
            )
        }
    }
}

export { GameBoard }