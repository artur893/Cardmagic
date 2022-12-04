import { Component } from "react";
import './GameBoard.css'
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';
import arrowImg from './images/arrow.png'
import hpIcon from './images/heart.png'
import costIcon from './images/mana.png'
import attackIcon from './images/sword.png'

class GameBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isGameOver: false,
            numberOfRound: 0.5,
            playerOnMove: 'PlayerOne',
            tableToPick: 'card-table-one',
            playerTarget: 'PlayerTwo',
            tableToAttack: 'card-table-two',
            playerOne: null,
            playerTwo: null
        }

        this.nextRound = this.nextRound.bind(this)
        this.addTotalMana = this.addTotalMana.bind(this)
        this.gameFlow = this.gameFlow.bind(this)
        this.pickCardToPlay = this.pickCardToPlay.bind(this)
        this.putCardOnTable = this.putCardOnTable.bind(this)
        this.pickCardToAttack = this.pickCardToAttack.bind(this)
        this.targetAttackedEnemy = this.targetAttackedEnemy.bind(this)
        this.killCards = this.killCards.bind(this)
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
        this.isGameOver()
    }

    isGameOver() {
        if ((this.state.playerOne?.hp <= 0 && !this.state.isGameOver) || (this.state.playerTwo?.hp <= 0 && !this.state.isGameOver)) {
            this.setState({ isGameOver: true })
        }
    }

    initStartCards(player) {
        const playerClone = cloneDeep(this.state[player])
        const onHand = []
        for (let i = 0; i < 3; i++) {
            const random = Math.random() * (playerClone.cards.length - 1)
            const randomCard = playerClone.cards.splice(random.toFixed(0), 1)[0]
            onHand.push(randomCard)
        }
        playerClone['onHand'] = onHand
        this.setState({ [player]: playerClone })
    }

    async gameFlow() {
        await this.nextRound()
        await this.switchPlayerOnMove()
        await this.addTotalMana()
        await this.getNewCard()
        await this.clearHands()
        this.spinArrow()
        this.clearMove(this.state.playerOnMove)
    }

    async switchPlayerOnMove() {
        if (Number.isInteger(this.state.numberOfRound)) {
            this.setState({
                playerOnMove: 'playerOne',
                playerTarget: 'playerTwo',
                tableToPick: 'card-table-one',
                tableToAttack: 'card-table-two'
            })
        } else {
            this.setState({
                playerOnMove: 'playerTwo',
                playerTarget: 'playerOne',
                tableToPick: 'card-table-two',
                tableToAttack: 'card-table-one'
            })
        }
    }

    async nextRound() {
        let round = this.state.numberOfRound
        round += 0.5
        this.setState({ numberOfRound: round })
    }

    async getNewCard() {
        if (this.state[this.state.playerOnMove].onHand.length < 6) {
            const playerClone = cloneDeep(this.state[this.state.playerOnMove])
            const random = Math.random() * (playerClone.cards.length - 1)
            const randomCard = playerClone.cards.splice(random.toFixed(0), 1)[0]
            playerClone.onHand.push(randomCard)
            this.setState({ [this.state.playerOnMove]: playerClone })
        }
    }

    async clearHands() {
        const playerOne = cloneDeep(this.state.playerOne)
        const playerTwo = cloneDeep(this.state.playerTwo)
        playerOne.cardToAttack = null
        playerOne.inHand = null
        playerTwo.inHand = null
        playerTwo.cardToAttack = null
        this.setState({
            playerOne: playerOne,
            playerTwo: playerTwo
        })
    }

    async addTotalMana() {
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

    clearMove(player) {
        const clone = cloneDeep(this.state[player])
        clone.onTable.forEach((card) => {
            if (card) {
                card['isMadeMove'] = false
            }
        })
        this.setState({ [player]: clone })
    }

    pickCardToPlay(e, player) {
        const index = this.state[player].onHand.findIndex(card => card.id === e.target.id)
        const inHand = this.state[player].onHand[index]
        const playerClone = cloneDeep(this.state[player])
        playerClone['inHand'] = inHand
        this.setState({ [player]: playerClone })
    }

    removeCardOnHand(player) {
        const index = player.onHand.findIndex(card => card.id === player.inHand.id)
        player.onHand.splice(index, 1)
    }

    putCardOnTable(e, player, cardTable) {
        if (this.state[player]?.inHand) {
            const clone = cloneDeep(this.state[player])
            if (e.target.parentElement.id === cardTable) {
                if (clone.inHand.cost <= clone.mana) {
                    clone.onTable[e.target.getAttribute('index')] = clone.inHand
                    clone.onTable[e.target.getAttribute('index')]['isMadeMove'] = true
                    clone['mana'] = clone.mana - clone.inHand.cost
                    this.removeCardOnHand(clone)
                    clone['inHand'] = null
                    this.setState({ [player]: clone })
                }
            }
        }
    }

    spinArrow() {
        const arrow = document.querySelector('img')
        if (Number.isInteger(this.state.numberOfRound % 1)) {
            arrow.classList.add('spin')
        } else {
            arrow.classList.remove('spin')
        }
    }

    pickCardToAttack(e, table) {
        if (table === this.state.tableToPick) {
            const index = this.state[this.state.playerOnMove].onTable.findIndex(card => {
                if (card) {
                    return card.id === e.target.id
                }
                return card
            })
            const cardToAttack = this.state[this.state.playerOnMove].onTable[index]
            const playerClone = cloneDeep(this.state[this.state.playerOnMove])
            playerClone['cardToAttack'] = cardToAttack
            this.setState({ [this.state.playerOnMove]: playerClone })
        }
    }

    attackEnemyHero(enemyClone, playerClone) {
        if (!playerClone.cardToAttack.isMadeMove) {
            playerClone.cardToAttack.attackEnemy(enemyClone)
            this.setState({ [this.state.playerTarget]: enemyClone })
            const attackerIndex = playerClone.onTable.findIndex((card) => {
                if (card) {
                    return card.id === playerClone.cardToAttack.id
                }
                return card
            })
            playerClone.onTable[attackerIndex]['isMadeMove'] = true
            this.setState({ [this.state.playerOnMove]: playerClone })
        }
    }

    async attackEnemyCard(e, enemyClone, playerClone) {
        const index = enemyClone.onTable.findIndex(card => {
            if (card) {
                return card.id === e.target.id
            }
            return card
        })
        if (!playerClone.cardToAttack.isMadeMove) {
            playerClone.cardToAttack.attackEnemy(enemyClone.onTable[index])
            const attackerIndex = playerClone.onTable.findIndex((card) => {
                if (card) {
                    return card.id === playerClone.cardToAttack.id
                }
                return card
            })
            playerClone.onTable[attackerIndex] = playerClone.cardToAttack
            playerClone.onTable[attackerIndex]['isMadeMove'] = true
            await this.setState({
                [this.state.playerTarget]: enemyClone,
                [this.state.playerOnMove]: playerClone
            })
            this.killCards()
        }
    }

    targetAttackedEnemy(e, table) {
        const event = e
        if (table === this.state.tableToAttack) {
            const enemyClone = cloneDeep(this.state[this.state.playerTarget])
            const playerClone = cloneDeep(this.state[this.state.playerOnMove])
            if (e.target.id === 'player-one' || e.target.id === 'player-two') {
                this.attackEnemyHero(enemyClone, playerClone)
            } else {
                this.attackEnemyCard(event, enemyClone, playerClone)
            }
        }
    }

    killCards() {
        const clonePlayer = cloneDeep(this.state[this.state.playerOnMove])
        const cloneTarget = cloneDeep(this.state[this.state.playerTarget])
        cloneTarget?.onTable.forEach((card) => {
            if (card?.hp <= 0) {
                const index = cloneTarget.onTable.findIndex(cardToIndex => cardToIndex?.id === card.id)
                cloneTarget.onTable[index] = null
            }
        })
        clonePlayer?.onTable.forEach((card) => {
            if (card?.hp <= 0) {
                const index = clonePlayer.onTable.findIndex(cardToIndex => cardToIndex?.id === card.id)
                clonePlayer.onTable[index] = null
            }
        })
        this.setState({ [this.state.playerTarget]: cloneTarget, [this.state.playerOnMove]: clonePlayer })
    }

    showWinner() {
        if (this.state.playerOne.hp > 0) {
            return this.state.playerOne.name
        } else {
            return this.state.playerTwo.name
        }
    }

    render() {
        if (this.props.isHeroesPicked && !this.state.isGameOver) {
            return (
                <>
                    <div className="round-control">
                        <img src={arrowImg} alt='arrow' className="nospin"></img>
                        <button onClick={this.gameFlow}>NEXT ROUND</button>
                    </div>
                    <CardTable id='card-table-one' hero={this.state.playerOne} playerOnMove={this.state.playerOnMove} playerTarget={this.state.playerTarget}
                        putCardOnTable={this.putCardOnTable} onTable={this.state.playerOne.onTable} killCard={this.killCard}
                        pickCardToAttack={this.pickCardToAttack} targetAttackedEnemy={this.targetAttackedEnemy} />
                    <CardTable id='card-table-two' hero={this.state.playerTwo} playerOnMove={this.state.playerOnMove} playerTarget={this.state.playerTarget}
                        putCardOnTable={this.putCardOnTable} onTable={this.state.playerTwo.onTable} killCard={this.killCard}
                        pickCardToAttack={this.pickCardToAttack} targetAttackedEnemy={this.targetAttackedEnemy} />
                    <Player hero={this.state.playerOne} id='player-one' table='card-table-one' targetAttackedEnemy={this.targetAttackedEnemy} />
                    <Player hero={this.state.playerTwo} id='player-two' table='card-table-two' targetAttackedEnemy={this.targetAttackedEnemy} />
                    <OnHandCards hero={this.state.playerOne} isHeroesPicked={this.props.isHeroesPicked}
                        id='player-one-cards' pickCardToPlay={this.pickCardToPlay} player={'playerOne'} />
                    <OnHandCards hero={this.state.playerTwo} isHeroesPicked={this.props.isHeroesPicked}
                        id='player-two-cards' pickCardToPlay={this.pickCardToPlay} player={'playerTwo'} />
                </>
            )
        } if (this.props.isHeroesPicked && this.state.isGameOver) {
            return (
                <>
                    <div className="winner">{`The winner is ${this.showWinner()}`}</div>
                </>
            )
        }
    }
}

class Player extends Component {
    render() {
        return (
            <div className="player" id={this.props.id}
                onClick={(e) => {
                    this.props.targetAttackedEnemy(e, this.props.table)
                }}>

                <div className="player-icon"><img src={this.props.hero.icon} alt={this.props.hero.name}></img></div>
                <div className='player-bottom'>
                    <div className="player-hp">{this.props.hero.hp}<img src={hpIcon} alt='heart'></img></div>
                    <div className="player-mana">{this.props.hero.mana}<img src={costIcon} alt='mana'></img></div>
                </div>
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

    componentDidUpdate() {
        this.markCardInHand()
    }

    markCardInHand() {
        this.props.hero.onHand.forEach((card) => {
            if (card?.id === this.props.hero?.inHand?.id && this.props.hero.mana >= card?.cost) {
                const cardToMark = document.getElementById(card.id)
                cardToMark.classList.add('inhand')
            }
            if (card?.id === this.props.hero?.inHand?.id && this.props.hero.mana < card?.cost) {
                const cardToMark = document.getElementById(card.id)
                cardToMark.classList.add('inhand-red')
            }
        })
    }

    screenGameMode() {
        const gameContainer = document.querySelector('.game-container')
        gameContainer.classList.add('game-mode')
    }

    populateCards() {
        if (this.state.isHeroDataLoaded) {
            const onHand = this.props.hero.onHand.map((card) => {
                return (
                    <div className="onhand-card" id={card.id} key={uuid()} onClick={(e) => this.props.pickCardToPlay(e, this.props.player)}>
                        <div className="onhand-card-top">
                            <div className="onhand-cost" key={uuid()}>{card.cost} <img src={costIcon} alt='mana'></img></div>
                        </div>
                        <div className="onhand-name" key={uuid()}>{card.name}</div>
                        <p className="onhand-description" key={uuid()}>{ }</p>
                        <div className="onhand-card-bottom">
                            <div className="onhand-attack" key={uuid()}>{card.attack}<img src={attackIcon} alt='sword'></img></div>
                            <div className="onhand-hp" key={uuid()}>{card.hp}<img src={hpIcon} alt='heart'></img></div>
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

    componentDidUpdate() {
        this.hideUsedCards()
        this.markCardToAttack()
    }

    hideUsedCards() {
        this.props.onTable.forEach((card) => {
            if (card?.isMadeMove) {
                const cardToHide = document.getElementById(card.id)
                cardToHide.classList.add('used')
            }
        })
    }

    markCardToAttack() {
        this.props.hero.onTable.forEach((card) => {
            if (card?.id === this.props?.hero?.cardToAttack?.id && !card?.isMadeMove && card !== null) {
                const cardToMark = document.getElementById(card.id)
                cardToMark.classList.add('inhand')
            }
        })
    }

    displayCard(index) {
        if (this.props.onTable) {
            if (this.props.onTable[index]) {
                return (
                    <div className="onhand-card" id={this.props.onTable[index].id} key={uuid()} onClick={(e) => {
                        this.props.pickCardToAttack(e, this.props.id)
                        this.props.targetAttackedEnemy(e, this.props.id)
                    }}>
                        <div className="onhand-card-top">
                            <div className="onhand-cost" key={uuid()}>{this.props.onTable[index].cost}<img src={costIcon} alt='mana'></img></div>
                        </div>
                        <div className="onhand-name" key={uuid()}>{this.props.onTable[index].name}</div>
                        <p className="onhand-description" key={uuid()}>{ }</p>
                        <div className="onhand-card-bottom">
                            <div className="onhand-attack" key={uuid()}>{this.props.onTable[index].attack}<img src={attackIcon} alt='sword'></img></div>
                            <div className="onhand-hp" key={uuid()}>{this.props.onTable[index].hp}<img src={hpIcon} alt='heart'></img></div>
                        </div>
                    </div>)
            }
        }
    }

    render() {
        return (
            <div className="card-table" id={this.props.id}>
                <div className="card-field" id="card-field-1" index='0' onClick={(e) => this.props.putCardOnTable(e, this.props.playerOnMove, this.props.id)}>
                    {this.displayCard(0)}</div>
                <div className="card-field" id="card-field-2" index='1' onClick={(e) => this.props.putCardOnTable(e, this.props.playerOnMove, this.props.id)}>
                    {this.displayCard(1)}</div>
                <div className="card-field" id="card-field-3" index='2' onClick={(e) => this.props.putCardOnTable(e, this.props.playerOnMove, this.props.id)}>
                    {this.displayCard(2)}</div>
                <div className="card-field" id="card-field-4" index='3' onClick={(e) => this.props.putCardOnTable(e, this.props.playerOnMove, this.props.id)}>
                    {this.displayCard(3)}</div>
                <div className="card-field" id="card-field-5" index='4' onClick={(e) => this.props.putCardOnTable(e, this.props.playerOnMove, this.props.id)}>
                    {this.displayCard(4)}</div>
                <div className="card-field" id="card-field-6" index='5' onClick={(e) => this.props.putCardOnTable(e, this.props.playerOnMove, this.props.id)}>
                    {this.displayCard(5)}</div>
            </div>)
    }
}

export { GameBoard }