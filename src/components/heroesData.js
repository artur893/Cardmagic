import warriorIcon from './images/helmet.png'
import wizardIcon from './images/wizard.png'
import monkIcon from './images/monk.png'
import vampireIcon from './images/vampire.png'
import { cloneDeep } from 'lodash'

const heroes = [{
    name: 'Wojownik',
    hp: 30,
    skillName: 'Szarżuj',
    skillText: 'Zadaj 2pkt obrażeń wybranej karcie',
    skill: 'method here',
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
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: monkIcon,
    attack: 0
}, {
    name: 'Wampir',
    hp: 30,
    skillName: 'Ugryzienie',
    skillText: 'Zadaj 1pkt obrażeń, ulecz się 1hp',
    skill: 'method here',
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
    const clonePlayerOne = cloneDeep(this.state[this.state.playerOnMove])
    clonePlayerOne.skillAvailable = false
    this.setState((state) => {
        return { [state.playerOnMove]: clonePlayerOne }
    })
}

function waveOfFlames() {
    if (this.state[this.state.playerOnMove].skillAvailable) {
        const dealDmg = deal1DmgAll.bind(this)
        const setSkillUnavailable = setSkillUsed.bind(this)
        blockEvents(1000)
        activeFlamesAnimation()
        dealDmg()
        setSkillUnavailable()
    }
}

export { heroes }