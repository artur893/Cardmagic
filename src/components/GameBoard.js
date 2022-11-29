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
        this.pickCardToPlay = this.pickCardToPlay.bind(this)
        this.putCardOnTable = this.putCardOnTable.bind(this)
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

    pickCardToPlay(e, player) {
        const index = this.state[player].onHand.findIndex(card => card.name === e.target.children[0].children[0].textContent)
        const inHand = this.state[player].onHand[index]
        const playerClone = cloneDeep(this.state[player])
        playerClone['inHand'] = inHand
        this.setState({ [player]: playerClone })
    }

    removeCardOnTableFromHand(player) {
        console.log(player)
        const index = player.onHand.findIndex(card => card.name === player.inHand.name)
        player.onHand.splice(index, 1)
    }

    putCardOnTable(e, player, cardTable) {
        if (this.state[player].inHand) {
            const clone = cloneDeep(this.state[player])
            console.log('STATE:', this.state[player])
            console.log('CLONE:', clone)
            console.log(e.target.parentElement.id)
            if (e.target.parentElement.id === cardTable) {
                clone.onTable[e.target.getAttribute('index')] = clone.inHand
                this.removeCardOnTableFromHand(clone)
                clone['inHand'] = null
                this.setState({ [player]: clone })
            }
        }
    }

    render() {
        if (this.props.isHeroesPicked) {
            return (
                <>
                    <button onClick={this.gameControl}>NEXT ROUND</button>
                    <CardTable id='card-table-one' putCardOnTable={this.putCardOnTable} onTable={this.state.playerOne.onTable} player={'playerOne'} />
                    <CardTable id='card-table-two' putCardOnTable={this.putCardOnTable} onTable={this.state.playerTwo.onTable} player={'playerTwo'} />
                    <Player hero={this.state.playerOne} id='player-one' />
                    <Player hero={this.state.playerTwo} id='player-two' />
                    <OnHandCards hero={this.state.playerOne} isHeroesPicked={this.props.isHeroesPicked}
                        id='player-one-cards' pickCardToPlay={this.pickCardToPlay} player={'playerOne'} />
                    <OnHandCards hero={this.state.playerTwo} isHeroesPicked={this.props.isHeroesPicked}
                        id='player-two-cards' pickCardToPlay={this.pickCardToPlay} player={'playerTwo'} />
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
                    <div className="onhand-card" key={uuid()} onClick={(e) => this.props.pickCardToPlay(e, this.props.player)}>
                        <div className="onhand-card-top">
                            <div className="onhand-name" key={uuid()}>{card.name}</div>
                            <div className="onhand-cost" key={uuid()}>{card.cost}</div>
                        </div>
                        <p className="onhand-description" key={uuid()}>{ }</p>
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

class CardTable extends Component {

    displayCard(index) {
        if (this.props.onTable) {
            if (this.props.onTable[index]) {
                return (
                    <div className="onhand-card" key={uuid()}>
                        <div className="onhand-card-top">
                            <div className="onhand-name" key={uuid()}>{this.props.onTable[index].name}</div>
                            <div className="onhand-cost" key={uuid()}>{this.props.onTable[index].cost}</div>
                        </div>
                        <p className="onhand-description" key={uuid()}>{ }</p>
                        <div className="onhand-card-bottom">
                            <div className="onhand-attack" key={uuid()}>{this.props.onTable[index].attack}</div>
                            <div className="onhand-hp" key={uuid()}>{this.props.onTable[index].hp}</div>
                        </div>
                    </div>)
            }
        }
    }

    render() {
        return (
            <div className="card-table" id={this.props.id}>
                <div className="card-field" id="card-field-1" index='0' onClick={(e) => this.props.putCardOnTable(e, this.props.player, this.props.id)}>{this.displayCard(0)}</div>
                <div className="card-field" id="card-field-2" index='1' onClick={(e) => this.props.putCardOnTable(e, this.props.player, this.props.id)}>{this.displayCard(1)}</div>
                <div className="card-field" id="card-field-3" index='2' onClick={(e) => this.props.putCardOnTable(e, this.props.player, this.props.id)}>{this.displayCard(2)}</div>
                <div className="card-field" id="card-field-4" index='3' onClick={(e) => this.props.putCardOnTable(e, this.props.player, this.props.id)}>{this.displayCard(3)}</div>
                <div className="card-field" id="card-field-5" index='4' onClick={(e) => this.props.putCardOnTable(e, this.props.player, this.props.id)}>{this.displayCard(4)}</div>
                <div className="card-field" id="card-field-6" index='5' onClick={(e) => this.props.putCardOnTable(e, this.props.player, this.props.id)}>{this.displayCard(5)}</div>
            </div>)
    }
}

export { GameBoard }