import warriorIcon from './images/helmet.png'
import wizardIcon from './images/wizard.png'
import monkIcon from './images/monk.png'
import vampireIcon from './images/vampire.png'

const heroes = [{
    name: 'Wojownik',
    hp: 5,
    skillName: 'Szarża',
    skillText: 'Zadaj 2pkt obrażeń wybranej karcie',
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: warriorIcon
}, {
    name: 'Czarodziej',
    hp: 30,
    skillName: 'Omam',
    skillText: 'Zadaj 1pkt obrażeń każdej karcie',
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: wizardIcon
}, {
    name: 'Mnich',
    hp: 30,
    skillName: 'Medytuj',
    skillText: 'Dodaj sobie 1pkt maksymalnej many',
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: monkIcon
}, {
    name: 'Wampir',
    hp: 30,
    skillName: 'Ugryź',
    skillText: 'Zadaj 1pkt obrażeń, ulecz się 1hp',
    skill: 'method here',
    totalMana: 0,
    mana: 0,
    icon: vampireIcon
}]

export { heroes }