import { cloneDeep } from 'lodash';

function aiModuleEasy() {
    if (this.state.isAiTurn) {
        this.setState({ isAiTurn: false })
        setTimeout(() => this.aiPickRandomCard(), 3000)
        setTimeout(() => this.aiPutCardOnTable(), 3600)
        setTimeout(() => this.aiRandomAttack(), 3900)
        setTimeout(() => this.killCards(), 5500)
        setTimeout(() => this.gameFlow(), 6000)
    }
}

function aiPickRandomCard() {
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

function aiRandomAttack() {
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

function aiAttackEnemyCardAI(state, enemyIndexes) {
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