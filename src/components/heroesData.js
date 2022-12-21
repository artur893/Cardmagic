import warriorIcon from './images/helmet.png'
import wizardIcon from './images/wizard.png'
import monkIcon from './images/monk.png'
import vampireIcon from './images/vampire.png'
import { cloneDeep } from 'lodash'

const heroes = [{
    name: 'Wojownik',
    hp: 30,
    skillName: 'Szarżuj',
    skillText: 'Zadaj 2pkt obrażeń przeciwnemu bohaterowi',
    skill: charge,
    totalMana: 0,
    mana: 0,
    icon: warriorIcon,
    attack: 0
}, {
    name: 'Czarodziej',
    hp: 30,
    skillName: 'Fala ognia',
    skillText: 'Zadaj 1pkt obrażeń każdej karcie',
    skill: waveOfFlames,
    totalMana: 0,
    mana: 0,
    icon: wizardIcon,
    attack: 0
}, {
    name: 'Mnich',
    hp: 30,
    skillName: 'Medytuj',
    skillText: 'Dodaj sobie 1pkt maksymalnej many',
    skill: meditate,
    totalMana: 0,
    mana: 0,
    icon: monkIcon,
    attack: 0
}, {
    name: 'Wampir',
    hp: 30,
    skillName: 'Ugryzienie',
    skillText: 'Zadaj 1pkt obrażeń przeciwnikowi, ulecz się 1hp',
    skill: meditate,
    totalMana: 0,
    mana: 0,
    icon: vampireIcon,
    attack: 0
}]

function blockEvents(time) {
    document.querySelector('.game-container').classList.add('blocked')
    setTimeout(() => {
        document.querySelector('.game-container').classList.remove('blocked')
    }, time)
}

function activeFlamesAnimation() {
    const flames = document.querySelectorAll('.flames')
    flames.forEach((flame) => flame.classList.add('active'))
    setTimeout(() => { flames.forEach((flame) => flame.classList.remove('active')) }, 1000)
}

function deal1DmgAll() {
    const clonePlayerOne = cloneDeep(this.state[this.state.playerOnMove])
    const playerOneCards = clonePlayerOne.onTable.map((card) => {
        if (card) {
            card.hp = card.hp - 1
            return card
        } else return card
    })
    clonePlayerOne.onTable = playerOneCards
    const clonePlayerTwo = cloneDeep(this.state[this.state.playerTarget])
    const playerTwoCards = clonePlayerTwo.onTable.map((card) => {
        if (card) {
            card.hp = card.hp - 1
            return card
        } else return card
    })
    clonePlayerTwo.onTable = playerTwoCards
    this.setState((state) => {
        return {
            [state.playerOnMove]: clonePlayerOne,
            [state.playerTarget]: clonePlayerTwo
        }
    })
}

function setSkillUsed() {
    this.setState((state) => {
        const clonePlayer = cloneDeep(state[this.state.playerOnMove])
        clonePlayer.skillAvailable = false
        return { [state.playerOnMove]: clonePlayer }
    })
}

function skillCost() {
    this.setState((state) => {
        const clonePlayer = cloneDeep(state[this.state.playerOnMove])
        clonePlayer.mana = clonePlayer.mana - 2
        return { [state.playerOnMove]: clonePlayer }
    })
}

function animateMeditate(player) {
    const avatar = document.getElementById(player)
    avatar.classList.add('meditate')
    setTimeout(() => avatar.classList.remove('meditate'), 2000)
}

function animateCharge(player) {
    const avatar = document.getElementById(player)
    avatar.classList.add('charge')
    setTimeout(() => avatar.classList.remove('charge'), 3000)
}

function animateDmg() {
    const cardTable = document.querySelectorAll('.card-table')
    cardTable.forEach((table) => {
        const card = table.querySelector('.onhand-card')
        if (card) {
            card.classList.add('damaged-animate')
            setTimeout(() => { card.classList.remove('damaged-animate') }, 1000)
        }
    })
}

function killCards() {
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

function charge() {
    const clonePlayer = cloneDeep(this.state[this.state.playerOnMove])
    const animate = animateCharge.bind(this)
    animate(clonePlayer.playerId)

}

function waveOfFlames() {
    if (this.state[this.state.playerOnMove].skillAvailable && this.state[this.state.playerOnMove].mana >= 2) {
        const dealDmg = deal1DmgAll.bind(this)
        const setSkillUnavailable = setSkillUsed.bind(this)
        const cost = skillCost.bind(this)
        const kill = killCards.bind(this)
        blockEvents(1000)
        activeFlamesAnimation()
        dealDmg()
        setTimeout(() => { animateDmg() }, 100)
        setSkillUnavailable()
        cost()
        setTimeout(() => { kill() }, 1000)
    }
}

function meditate() {
    if (this.state[this.state.playerOnMove].skillAvailable && this.state[this.state.playerOnMove].mana >= 2) {
        const animate = animateMeditate.bind(this)
        const setSkillUnavailable = setSkillUsed.bind(this)
        const cost = skillCost.bind(this)
        const clonePlayer = cloneDeep(this.state[this.state.playerOnMove])
        animate(clonePlayer.playerId)
        clonePlayer.totalMana = clonePlayer.totalMana + 1
        this.setState((state) => {
            return { [state.playerOnMove]: clonePlayer }
        })
        setSkillUnavailable()
        cost()
    }
}

export { heroes }