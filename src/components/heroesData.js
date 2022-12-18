import warriorIcon from './images/helmet.png'
import wizardIcon from './images/wizard.png'
import monkIcon from './images/monk.png'
import vampireIcon from './images/vampire.png'

const heroes = [{
    name: 'Wojownik',
    hp: 30,
    skillName: 'Szarża',
    skillText: 'Zadaj 2pkt obrażeń wybranej karcie',
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: warriorIcon,
    attack: 0
}, {
    name: 'Czarodziej',
    hp: 30,
    skillName: 'Omam',
    skillText: 'Zadaj 1pkt obrażeń każdej karcie',
    skill: 'method here',
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
    skillName: 'Ugryź',
    skillText: 'Zadaj 1pkt obrażeń, ulecz się 1hp',
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: vampireIcon,
    attack: 0
}]

export { heroes }