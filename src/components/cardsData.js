import { v4 as uuid } from 'uuid';

class Mob {
    constructor(name, attack, hp, cost, skill, type) {
        this.id = uuid()
        this.name = name
        this.attack = attack
        this.hp = hp
        this.cost = cost
        this.skill = skill
        this.type = type
    }

    attackEnemy(enemy) {
        enemy.hp = enemy.hp - this.attack
        this.hp = this.hp - enemy.attack
        this.lastDmg = enemy.attack
        enemy.lastDmg = this.attack
    }
}

const cardsOne = []
const cardsTwo = []

function populateCards() {
    rawCards.forEach((card) => {
        const mob = new Mob(card.name, card.attack, card.hp, card.cost, card.skill, card.type)
        cardsOne.push(mob)
    })
    rawCards.forEach((card) => {
        const mob = new Mob(card.name, card.attack, card.hp, card.cost, card.skill, card.type)
        cardsTwo.push(mob)
    })
}

const rawCards = [{
    name: 'Goblin',
    attack: 1,
    hp: 1,
    cost: 1,
    skill: null,
    type: 'mob'
},
{
    name: 'Ratler',
    attack: 2,
    hp: 1,
    cost: 1,
    skill: null,
    type: 'mob'
}, {
    name: 'Straw knight',
    attack: 1,
    hp: 1,
    cost: 1,
    skill: null,
    type: 'mob'
}, {
    name: 'Humpbacked Angel',
    attack: 2,
    hp: 2,
    cost: 2,
    skill: null,
    type: 'mob'
}, {
    name: 'Dwarf Rambo',
    attack: 3,
    hp: 1,
    cost: 2,
    skill: null,
    type: 'mob'
}, {
    name: 'Guard',
    attack: 2,
    hp: 3,
    cost: 2,
    skill: null,
    type: 'mob'
}, {
    name: 'Policeman',
    attack: 3,
    hp: 3,
    cost: 3,
    skill: null,
    type: 'mob'
}, {
    name: 'Mortar',
    attack: 1,
    hp: 5,
    cost: 3,
    skill: null,
    type: 'mob'
}, {
    name: 'Surgeon',
    attack: 3,
    hp: 3,
    cost: 3,
    skill: null,
    type: 'mob'
}, {
    name: 'SWAT Operator',
    attack: 4,
    hp: 4,
    cost: 4,
    skill: null,
    type: 'mob'
}, {
    name: 'Doberman',
    attack: 3,
    hp: 4,
    cost: 4,
    skill: null,
    type: 'mob'
}, {
    name: 'Blind sniper',
    attack: 6,
    hp: 4,
    cost: 5,
    skill: null,
    type: 'mob'
}, {
    name: 'Golem',
    attack: 3,
    hp: 9,
    cost: 5,
    skill: null,
    type: 'mob'
}, {
    name: 'Golden dragon',
    attack: 6,
    hp: 6,
    cost: 6,
    skill: null,
    type: 'mob'
}, {
    name: 'Black dragon',
    attack: 8,
    hp: 8,
    cost: 7,
    skill: null,
    type: 'mob'
}]

populateCards()

export { cardsOne, cardsTwo }