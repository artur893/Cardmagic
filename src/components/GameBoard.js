import { Component } from "react";
import ReactDOM from 'react-dom';
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
        this.displayCardsOnTable()
    }

    pickCardToPlay(e) {
        const allCards = document.querySelectorAll('.onhand-card')
        allCards.forEach(card => card.classList.remove('inhand'))
        e.target.classList.add('inhand')
        const index = this.state.playerOne.onHand.findIndex(card => card.name === e.target.children[0].children[0].textContent)
        const inHand = this.state.playerOne.onHand[index]

        const playerClone = cloneDeep(this.state.playerOne)
        playerClone['inHand'] = inHand
        this.setState({ playerOne: playerClone })
    }

    putCardOnTable(e) {
        if (this.state.playerOne.inHand) {
            const clone = cloneDeep(this.state.playerOne)
            console.log(e.target.getAttribute('index'))
            clone.onTable[e.target.getAttribute('index')] = clone.inHand
            this.setState({ playerOne: clone })
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

    displayCardsOnTable() {
        if (this.props.isHeroesPicked) {
            const isEmptyArr = this.state.playerOne.onTable.every(value => value === null)
            console.log(isEmptyArr)
            const onTable = this.state.playerOne.onTable.map((card) => {
                if (card) {
                    return (
                        <div className="onhand-card" key={uuid()}>
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
                }
                return card
            })
            if (!isEmptyArr) {
                setTimeout(() => {

                })
                const field = document.querySelector('#card-field-1')
                console.log(field)
                console.log(onTable[0])
                const div = document.createElement('div')
                div.textContent = 'works'
                console.log(div)
                ReactDOM.createPortal(<div>CEUBLKA</div>, field)
                console.log(onTable)
            }
        }
    }


    render() {
        if (this.props.isHeroesPicked) {
            return (
                <>
                    <button onClick={this.gameControl}>NEXT ROUND</button>
                    <CardTable id='card-table-one' putCardOnTable={this.putCardOnTable} onTable={this.state.playerOne.onTable} />
                    <CardTable id='card-table-two' putCardOnTable={this.putCardOnTable} />
                    <Player hero={this.state.playerOne} id='player-one' />
                    <Player hero={this.state.playerTwo} id='player-two' />
                    <OnHandCards hero={this.state.playerOne} isHeroesPicked={this.props.isHeroesPicked} id='player-one-cards' pickCardToPlay={this.pickCardToPlay} />
                    <OnHandCards hero={this.state.playerTwo} isHeroesPicked={this.props.isHeroesPicked} id='player-two-cards' pickCardToPlay={this.pickCardToPlay} />
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
                    <div className="onhand-card" key={uuid()} onClick={(e) => this.props.pickCardToPlay(e)}>
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

    // displayCard() {
    //     if (this.props.onTable) {
    //         const isEmptyArr = this.props.onTable.every(value => value === null)
    //         console.log(isEmptyArr)
    //         if (!isEmptyArr) {
    //             console.log(this.props.onTable[0])
    //             console.log('have it')
    //             return <div>{this.props.onTable[0].name}</div>
    //         }
    //     }
    // }

    render() {
        return (
            <div className="card-table" id={this.props.id}>
                <div className="card-field" id="card-field-1" index='0' onClick={(e) => this.props.putCardOnTable(e)}></div>
                <div className="card-field" id="card-field-2" index='1' onClick={(e) => this.props.putCardOnTable(e)}></div>
                <div className="card-field" id="card-field-3" index='2' onClick={(e) => this.props.putCardOnTable(e)}></div>
                <div className="card-field" id="card-field-4" index='3' onClick={(e) => this.props.putCardOnTable(e)}></div>
                <div className="card-field" id="card-field-5" index='4' onClick={(e) => this.props.putCardOnTable(e)}></div>
                <div className="card-field" id="card-field-6" index='5' onClick={(e) => this.props.putCardOnTable(e)}></div>
            </div>)
    }
}

export { GameBoard }