import { Component } from "react";
import './GameBoard.css'
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';
import arrowImg from './images/arrow.png'
import hpIcon from './images/heart.png'
import costIcon from './images/mana.png'
import attackIcon from './images/sword.png'
import cardReverse from './images/cardReverse.jpg'

class GameBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAiTurn: false,
            isGameOver: false,
            numberOfRound: 0.5,
            playerOnMove: 'playerTwo',
            tableToPick: 'card-table-one',
            playerTarget: 'playerOne',
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
                isAiTurn: false,
                isGameOver: false,
                numberOfRound: 0.5,
                playerOnMove: 'playerTwo',
                tableToPick: 'card-table-one',
                playerTarget: 'playerOne',
                tableToAttack: 'card-table-two',
                playerOne: this.props.players[0],
                playerTwo: this.props.players[1]
            })
            if (this.props.isHeroesPicked) {
                this.initStartCards('playerOne')
                this.initStartCards('playerTwo')
                setTimeout(this.gameFlow, 500)
            }
        }
        this.isGameOver()
        this.spinArrow()
        this.aiModuleHard()
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
        this.randomNextCard(player)
    }

    //**************************************************************************
    //******************************** AI MODULE *******************************
    //**************************************************************************

    aiModuleEasy() {
        if (this.state.isAiTurn) {
            this.setState({ isAiTurn: false })
            setTimeout(() => this.aiPickRandomCard(), 3000)
            setTimeout(() => this.aiPutCardOnTable(), 3600)
            setTimeout(() => this.aiRandomAttack(), 3900)
            setTimeout(() => this.killCards(), 5500)
            setTimeout(() => this.gameFlow(), 6000)
        }
    }

    async aiModuleHard() {
        if (this.state.isAiTurn) {
            this.setState({ isAiTurn: false })
            await this.wait(3000)
            await this.aiPlayCards()
            await this.aiPreciseAttack()
            this.gameFlow()
        }
    }

    async wait(time) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), time)
        })
    }

    async aiPlayCards() {
        const cards = this.aiPickCardsAbleToPlay()
        const combinations = this.aiCreateCombinations(cards)
        const possibleToPlay = this.aiIsEnoughMana(combinations)
        this.aiSortCombinations(possibleToPlay)
        if (possibleToPlay.length > 0) {
            let wait
            possibleToPlay[0].forEach((card, i) => {
                setTimeout(() => { this.aiGrabCard(card) }, i * 2000)
                setTimeout(() => { this.aiPutCardOnTable() }, i * 2000 + 1000)
                wait = i
            })
            return new Promise((resolve) => {
                setTimeout(() => resolve(), (wait * 2000) + 2000)
            })
        }
    }

    aiPickCardsAbleToPlay() {
        const cards = []
        this.state.playerTwo?.onHand.forEach((card) => {
            if (card.cost <= this.state.playerTwo.mana) {
                cards.push(cloneDeep(card))
            }
        })
        return cards
    }

    aiCreateCombinations(cards) {
        const possibleCombinations = []
        for (let i = 1; i <= cards.length; i++) {
            const combinations = this.combinations(cards, i)
            possibleCombinations.push(combinations)
        }
        return possibleCombinations
    }

    aiIsEnoughMana(combinations) {
        const combinationsEnoughMana = []
        combinations.forEach((setOfComb) => {
            setOfComb.forEach((comb) => {
                let mana = this.state.playerTwo.mana
                comb.forEach((card) => {
                    mana = mana - card.cost
                })
                if (mana >= 0) {
                    combinationsEnoughMana.push(comb)
                }
            })
        })
        return combinationsEnoughMana
    }

    aiSortCombinations(combinations) {
        combinations.sort((a, b) => {
            let scoreA = 0
            let scoreB = 0
            a.forEach((card) => {
                scoreA = scoreA + card.attack + card.hp
            })
            b.forEach((card) => {
                scoreB = scoreB + card.attack + card.hp
            })
            if (scoreA > scoreB) {
                return -1
            } else {
                return 1
            }
        })
    }

    combinations(set, k) {
        let i, j, combs, head, tailcombs;
        if (k > set.length || k <= 0) {
            return [];
        }
        if (k === set.length) {
            return [set];
        }
        if (k === 1) {
            combs = [];
            for (i = 0; i < set.length; i++) {
                combs.push([set[i]]);
            }
            return combs;
        }
        combs = [];
        for (i = 0; i < set.length - k + 1; i++) {
            head = set.slice(i, i + 1);
            tailcombs = this.combinations(set.slice(i + 1), k - 1);
            for (j = 0; j < tailcombs.length; j++) {
                combs.push(head.concat(tailcombs[j]));
            }
        }
        return combs;
    }

    aiGrabCard(card) {
        const playerClone = cloneDeep(this.state.playerTwo)
        playerClone.inHand = card
        this.setState({ playerTwo: playerClone })
    }

    aiPickRandomCard() {
        const indexes = []
        this.state.playerTwo?.onHand.forEach((card, i) => {
            if (card.cost <= this.state.playerTwo.mana) {
                indexes.push(i)
            }
        })
        const index = Math.floor(Math.random() * indexes.length)
        const inHand = this.state.playerTwo.onHand[indexes[index]]
        const playerClone = cloneDeep(this.state.playerTwo)
        playerClone['inHand'] = inHand
        this.setState({ playerTwo: playerClone })
    }

    aiPutCardOnTable() {
        if (this.state.playerTwo?.inHand) {
            const clone = cloneDeep(this.state.playerTwo)
            const indexes = []
            this.state.playerTwo?.onTable.forEach((field, i) => {
                if (!field) {
                    indexes.push(i)
                }
            })
            this.setState({ playerTwo: clone })
            if (indexes.length > 0) {
                const index = Math.floor(Math.random() * indexes.length)
                clone.onTable[indexes[index]] = clone.inHand
                clone.onTable[indexes[index]]['isMadeMove'] = true
                clone['mana'] = clone.mana - clone.inHand.cost
                this.removeCardOnHand(clone)
                clone['inHand'] = null
                this.setState({ playerTwo: clone })
            }
        }
    }

    async aiPreciseAttack() {
        const cardsAbleToMove = this.aiFindCardsAbleToMove()
        let wait = 0
        cardsAbleToMove.forEach((card, i) => {
            setTimeout(() => {
                this.aiPickCardToAttack(card.index, i)
            }, i * 3500)
            setTimeout(() => {
                this.aiAnimateAttack()
            }, i * 3500 + 1000)
            setTimeout(() => {
                const cardsToBeAttacked = this.aiFindEnemyCardsToBeAttacked(this.state)
                const battlePairs = this.aiCreateBattlePairs(card, cardsToBeAttacked)
                const scoredPairs = this.aiScorePairs(battlePairs)
                const bestPairs = this.aiPickBestPair(scoredPairs)
                this.aiAttackCard(bestPairs)
            }, (i * 3500) + 2000)
            setTimeout(() => { this.killCards() }, (i * 3500) + 4000)
            wait = i + 1
        })
        return new Promise((resolve) => {
            let didThrow = 0
            if (wait > 1) {
                didThrow = 4500
            }
            setTimeout(() => resolve(), (wait * 3500) + didThrow)
        })
    }

    async aiAnimateAttack() {
        const cardDom = document.getElementById(this.state.playerTwo.cardToAttack.id)
        cardDom.classList.add('attack-animate-ai')
    }

    async aiAttackCard(pair) {
        if (pair.length > 0) {
            this.setState((state) => {
                const playerClone = cloneDeep(state.playerTwo)
                const enemyClone = cloneDeep(state.playerOne)
                playerClone.cardToAttack.attackEnemy(enemyClone.onTable[pair[0][0].defendor.index])
                const attackerIndex = playerClone.onTable.findIndex(card => card?.id === state.playerTwo.cardToAttack.id)
                playerClone.onTable[attackerIndex] = playerClone.cardToAttack
                playerClone.onTable[attackerIndex]['isMadeMove'] = true
                return {
                    playerOne: enemyClone,
                    playerTwo: playerClone
                }
            })
            await this.wait(1)
            this.animateLastDmg(this.state.playerOne.onTable[pair[0][0].defendor.index].id)
        } else {
            this.setState((state) => {
                return this.aiAttackEnemyHero(state)
            })
            await this.wait(1)
            this.aiAnimateHeroLastDmg()
        }
    }

    aiAnimateHeroLastDmg() {
        const enemyCardDom = document.getElementById('player-one')
        const enemyResultDom = enemyCardDom.querySelector('.player-hp-result')
        enemyCardDom.classList.add('active')
        setTimeout(() => { enemyCardDom.classList.remove('active') }, 2000)
        enemyResultDom.classList.add('active')
        setTimeout(() => { enemyResultDom.classList.remove('active') }, 2000)
    }

    aiPickBestPair(pairs) {
        const bestPairs = []
        pairs.forEach((card) => {
            const surviveAndKill = []
            const killAndDead = []
            const survivedNotKill = []
            card.forEach((pair) => {
                if (pair.score.didSurvive === true && pair.score.didKilled === true) {
                    surviveAndKill.push(pair)
                }
                if (pair.score.didSurvive === false && pair.score.didKilled === true) {
                    killAndDead.push(pair)
                }
                if (pair.score.didSurvive === true && pair.score.didKilled === false) {
                    survivedNotKill.push(pair)
                }
            })
            if (surviveAndKill.length > 0) {
                bestPairs.push(surviveAndKill)
            }
            if (surviveAndKill.length === 0 && killAndDead.length > 0) {
                bestPairs.push(killAndDead)
            }
            if (surviveAndKill.length === 0 && killAndDead.length === 0 && survivedNotKill.length > 0) {
                bestPairs.push(survivedNotKill)
            }
        })
        bestPairs.forEach((pair) => {
            pair.sort((a, b) => b.score.opponentValue - a.score.opponentValue)
        })
        return bestPairs
    }

    aiScorePairs(battlePairs) {
        const allScoredPairs = []
        battlePairs.forEach((card) => {
            const scoredPairs = []
            card.forEach((pair) => {
                const score = {
                    didSurvive: null,
                    didKilled: null,
                    opponentValue: null
                }
                if (pair.attacker.hp > pair.defendor.attack) {
                    score.didSurvive = true
                }
                if (pair.attacker.hp <= pair.defendor.attack) {
                    score.didSurvive = false
                }
                if (pair.attacker.attack >= pair.defendor.hp) {
                    score.didKilled = true
                }
                if (pair.attacker.attack < pair.defendor.hp) {
                    score.didKilled = false
                }
                score.opponentValue = pair.defendor.attack + pair.defendor.hp
                pair['score'] = score
                scoredPairs.push(pair)
            })
            allScoredPairs.push(scoredPairs)
        })
        return allScoredPairs
    }

    aiCreateBattlePairs(attacker, defendor) {
        const battlePairs = []
        const cardPairs = []
        defendor.forEach((defCard) => {
            cardPairs.push({ attacker: attacker, defendor: defCard })
        })
        battlePairs.push(cardPairs)
        return battlePairs
    }

    aiRandomAttack() {
        const indexes = this.aiFindCardsAbleToMove()
        indexes.forEach((index, i) => {
            this.aiPickCardToAttack(index, i)
            setTimeout(() => {
                this.setState((state) => {
                    const enemyCardAndIndexes = this.aiFindEnemyCardsToBeAttacked(state)
                    if (enemyCardAndIndexes.length > 0) {
                        return this.aiAttackEnemyCardAI(state, enemyCardAndIndexes)
                    } else {
                        return this.aiAttackEnemyHero(state)
                    }
                })
            }, i * 200 + 100)
        })
    }

    aiFindCardsAbleToMove() {
        const indexes = []
        const playerClone = cloneDeep(this.state.playerTwo)

        playerClone.onTable.forEach((card, i) => {
            if (card?.isMadeMove === false) {
                const copiedCard = cloneDeep(card)
                copiedCard['index'] = i
                indexes.push(copiedCard)
            }
        })
        return indexes
    }

    aiPickCardToAttack(index) {
        this.setState((state) => {
            const clone = cloneDeep(state.playerTwo)
            const cardToAttack = state.playerTwo.onTable[index]
            clone['cardToAttack'] = cardToAttack
            return { playerTwo: clone }
        })
    }

    aiFindEnemyCardsToBeAttacked(state) {
        const enemyIndexes = []
        const enemyClone = cloneDeep(state.playerOne)
        enemyClone.onTable.forEach((card, i) => {
            if (card) {
                const copiedCard = cloneDeep(card)
                copiedCard['index'] = i
                enemyIndexes.push(copiedCard)
            }
        })
        return enemyIndexes
    }

    aiAttackEnemyCardAI(state, enemyIndexes) {
        const playerClone = cloneDeep(state.playerTwo)
        const enemyClone = cloneDeep(state.playerOne)
        const index = Math.floor(Math.random() * enemyIndexes.length)
        playerClone.cardToAttack.attackEnemy(enemyClone.onTable[enemyIndexes[index]])
        const attackerIndex = playerClone.onTable.findIndex(card => card?.id === state.playerTwo.cardToAttack.id)
        playerClone.onTable[attackerIndex] = playerClone.cardToAttack
        playerClone.onTable[attackerIndex]['isMadeMove'] = true
        return {
            playerOne: enemyClone,
            playerTwo: playerClone
        }
    }

    aiAttackEnemyHero(state) {
        const playerClone = cloneDeep(state.playerTwo)
        const enemyClone = cloneDeep(state.playerOne)
        playerClone.cardToAttack.attackEnemy(enemyClone)
        const attackerIndex = playerClone.onTable.findIndex(card => card?.id === state.playerTwo.cardToAttack.id)
        playerClone.onTable[attackerIndex] = playerClone.cardToAttack
        playerClone.onTable[attackerIndex]['isMadeMove'] = true
        return {
            playerOne: enemyClone,
            playerTwo: playerClone
        }
    }
    //*************************************************************************
    //******************************** GAMEFLOW *******************************
    //*************************************************************************

    gameFlow() {
        this.nextRound()
        this.switchPlayerOnMove()
        this.addTotalMana()
        this.getCardAnimation(this.state.playerTarget)
        setTimeout(() => { this.getNewCard() }, 2500)
        this.clearHands()
        this.clearMove()
        this.setAiTurn()
    }

    isGameOver() {
        if ((this.state.playerOne?.hp <= 0 && !this.state.isGameOver) || (this.state.playerTwo?.hp <= 0 && !this.state.isGameOver)) {
            this.setState({ isGameOver: true })
        }
    }

    nextRound() {
        this.setState((state) => ({ numberOfRound: state.numberOfRound + 0.5 }))
    }

    switchPlayerOnMove() {
        this.setState((state) => {
            if (state.playerOnMove === 'playerTwo') {
                return {
                    playerOnMove: 'playerOne',
                    playerTarget: 'playerTwo',
                    tableToPick: 'card-table-one',
                    tableToAttack: 'card-table-two'
                }
            } else {
                return {
                    playerOnMove: 'playerTwo',
                    playerTarget: 'playerOne',
                    tableToPick: 'card-table-two',
                    tableToAttack: 'card-table-one'
                }
            }
        })
    }

    addTotalMana() {
        this.setState((state) => {
            if (state.playerOnMove === 'playerOne') {
                const playerOne = cloneDeep(state.playerOne)
                if (playerOne.totalMana < 10) {
                    playerOne['totalMana'] = playerOne.totalMana + 1
                }
                playerOne['mana'] = playerOne.totalMana
                const playerTwo = cloneDeep(state.playerTwo)
                if (playerTwo.totalMana < 10) {
                    playerTwo['totalMana'] = playerTwo.totalMana + 1
                }
                playerTwo['mana'] = playerTwo.totalMana
                return {
                    playerOne: playerOne,
                    playerTwo: playerTwo
                }
            }
        })
    }

    getNewCard() {
        this.setState((state) => {
            if (state[state.playerOnMove].onHand.length < 6) {
                const playerClone = cloneDeep(state[state.playerOnMove])
                playerClone.onHand.push(state[state.playerOnMove].nextCard)
                return { [state.playerOnMove]: playerClone }
            }
        })
        this.randomNextCard(this.state.playerOnMove)
    }

    getCardAnimation(player) {
        if (this.state[player].onHand.length < 6) {
            if (player === 'playerOne') {
                const index = 0
                const card = document.querySelectorAll('.deck-animate')
                card[index].classList.add('active')
                setTimeout(() => {
                    card[index].classList.remove('active')
                }, 2500)
            } else {
                const index = 1
                const card = document.querySelectorAll('.deck-animate')
                card[index].classList.add('active')
                setTimeout(() => {
                    card[index].classList.remove('active')
                }, 2500)
            }
        }
    }

    randomNextCard(player) {
        this.setState((state) => {
            const playerClone = cloneDeep(state[player])
            const random = Math.random() * (playerClone.cards.length - 1)
            const randomCard = playerClone.cards.splice(random.toFixed(0), 1)[0]
            playerClone['nextCard'] = randomCard
            return { [player]: playerClone }
        })
    }

    clearHands() {
        this.setState((state) => {
            const playerOne = cloneDeep(state.playerOne)
            const playerTwo = cloneDeep(state.playerTwo)
            playerOne.cardToAttack = null
            playerOne.inHand = null
            playerTwo.inHand = null
            playerTwo.cardToAttack = null
            return {
                playerOne: playerOne,
                playerTwo: playerTwo
            }
        })
    }

    clearMove() {
        this.setState((state) => {
            const clone = cloneDeep(state[state.playerOnMove])
            clone.onTable.forEach((card) => {
                if (card) {
                    card['isMadeMove'] = false
                }
            })
            return { [state.playerOnMove]: clone }
        })
    }

    setAiTurn() {
        this.setState((state) => {
            if (state.playerOnMove === 'playerTwo') {
                return { isAiTurn: true }
            }
        })
    }

    killCards() {
        this.setState((state) => {
            const clonePlayer = cloneDeep(state[state.playerOnMove])
            const cloneTarget = cloneDeep(state[state.playerTarget])
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
            return { [state.playerTarget]: cloneTarget, [state.playerOnMove]: clonePlayer }
        })
    }

    spinArrow() {
        const arrow = document.querySelector('img')
        if (this.state.playerOnMove === 'playerOne' && arrow) {
            arrow.classList.add('spin')
        } else if (arrow) {
            arrow.classList.remove('spin')
        }
    }

    showWinner() {
        if (this.state.playerOne.hp > 0) {
            return this.state.playerOne.name
        } else {
            return this.state.playerTwo.name
        }
    }

    displayButton() {
        if (Number.isInteger(this.state.numberOfRound)) {
            return <button onClick={() => {
                this.gameFlow()
            }}>NEXT ROUND</button>
        } else {
            return <button>WAIT</button>
        }
    }

    //*************************************************************************
    //************************** PLAYER GAME CONTROL **************************
    //*************************************************************************

    pickCardToPlay(e, player) {
        const index = this.state[player].onHand.findIndex(card => card.id === e.target.id)
        const inHand = this.state[player].onHand[index]
        const playerClone = cloneDeep(this.state[player])
        playerClone['inHand'] = inHand
        this.setState({ [player]: playerClone })
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

    removeCardOnHand(player) {
        const index = player.onHand.findIndex(card => card.id === player.inHand.id)
        player.onHand.splice(index, 1)
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

    async attackEnemyHero(enemyClone, playerClone) {
        if (!playerClone.cardToAttack.isMadeMove) {
            await this.animateAttack()
            playerClone.cardToAttack.attackEnemy(enemyClone)
            this.setState({ [this.state.playerTarget]: enemyClone })
            const attackerIndex = playerClone.onTable.findIndex((card) => {
                if (card) {
                    return card.id === playerClone.cardToAttack.id
                }
                return card
            })
            playerClone.onTable[attackerIndex]['isMadeMove'] = true
            playerClone.cardToAttack = null
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
        if (playerClone.cardToAttack && !playerClone?.cardToAttack?.isMadeMove) {
            playerClone.cardToAttack.attackEnemy(enemyClone.onTable[index])
            const attackerIndex = playerClone.onTable.findIndex((card) => {
                if (card) {
                    return card.id === playerClone.cardToAttack.id
                }
                return card
            })
            await this.animateAttack()
            playerClone.onTable[attackerIndex] = playerClone.cardToAttack
            playerClone.onTable[attackerIndex]['isMadeMove'] = true
            this.setState({
                [this.state.playerTarget]: enemyClone,
                [this.state.playerOnMove]: playerClone
            })
        }
        return e.target.id
    }

    animateLastDmg(id) {
        const cardDom = document.getElementById(this.state[this.state.playerOnMove].cardToAttack.id)
        const enemyCardDom = document.getElementById(id)
        const resultDom = cardDom.querySelector('.onhand-hp-result')
        const enemyResultDom = enemyCardDom.querySelector('.onhand-hp-result')
        resultDom.classList.add('active')
        enemyResultDom.classList.add('active')
        setTimeout(() => { resultDom.classList.remove('active') }, 2000)
        setTimeout(() => { enemyResultDom.classList.remove('active') }, 2000)
    }

    animateHeroLastDmg(e) {
        const enemyCardDom = document.getElementById(e.target.id)
        const enemyResultDom = enemyCardDom.querySelector('.player-hp-result')
        enemyResultDom.classList.add('active')
        setTimeout(() => { enemyResultDom.classList.remove('active') }, 2000)
        enemyCardDom.classList.add('active')
        setTimeout(() => { enemyCardDom.classList.remove('active') }, 2000)
    }

    async animateAttack() {
        const cardDom = document.getElementById(this.state[this.state.playerOnMove].cardToAttack.id)
        cardDom.classList.add('attack-animate')
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, 1000)
        })
    }

    async targetAttackedEnemy(e, table) {
        const event = e
        if (table === this.state.tableToAttack) {
            const enemyClone = cloneDeep(this.state[this.state.playerTarget])
            const playerClone = cloneDeep(this.state[this.state.playerOnMove])
            if (e.target.id === 'player-one' || e.target.id === 'player-two') {
                await this.attackEnemyHero(enemyClone, playerClone)
                this.animateHeroLastDmg(e)
            } else {
                const id = await this.attackEnemyCard(event, enemyClone, playerClone)
                await this.wait(1)
                this.animateLastDmg(id)
                setTimeout(() => this.killCards(), 2000)
            }
        }
    }

    render() {
        if (this.props.isHeroesPicked && !this.state.isGameOver && this.props.activeView === 'gameBoard') {
            return (
                <>
                    <div className="round-control">
                        <img src={arrowImg} alt='arrow' className="nospin"></img>
                        {this.displayButton()}
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
                    <Deck hero={this.state.playerOne} id='player-one-deck' />
                    <Deck hero={this.state.playerTwo} id='player-two-deck' />
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
                    <div className="player-hp">{this.props.hero.hp}<img src={hpIcon} alt='heart'></img>
                        <div className="player-hp-result">-{this.props.hero.lastDmg}</div>
                    </div>
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
                            <div className="onhand-hp" key={uuid()}>{this.props.onTable[index].hp}<img src={hpIcon} alt='heart'></img>
                                <div className="onhand-hp-result">-{this.props.onTable[index].lastDmg}</div>
                            </div>
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

class Deck extends Component {
    render() {
        return (
            <div className="deck" id={this.props.id}>
                <div className='deck-animate'>
                    <div className='deck-animate-back'>
                        <img src={cardReverse} alt='card reverse'></img>
                    </div>
                    <div className='deck-animate-front'>
                        <div className="onhand-card" id={this.props.hero.nextCard?.id} key={uuid()}>
                            <div className="onhand-card-top">
                                <div className="onhand-cost" key={uuid()}>{this.props.hero.nextCard?.cost} <img src={costIcon} alt='mana'></img></div>
                            </div>
                            <div className="onhand-name" key={uuid()}>{this.props.hero.nextCard?.name}</div>
                            <p className="onhand-description" key={uuid()}>{ }</p>
                            <div className="onhand-card-bottom">
                                <div className="onhand-attack" key={uuid()}>{this.props.hero.nextCard?.attack}<img src={attackIcon} alt='sword'></img></div>
                                <div className="onhand-hp" key={uuid()}>{this.props.hero.nextCard?.hp}<img src={hpIcon} alt='heart'></img></div>
                            </div>
                        </div>
                    </div>
                </div>
                <img src={cardReverse} alt='card reverse'></img>
                <div className="deck-left">Cards left:&nbsp;{this.props.hero.cards.length}</div>
            </div>)
    }
}

export { GameBoard }