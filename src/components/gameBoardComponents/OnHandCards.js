import { Component } from "react";
import './OnHandCards.css'
import hpIcon from '../images/heart.png'
import costIcon from '../images/mana.png'
import attackIcon from '../images/sword.png'
import { v4 as uuid } from 'uuid';

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

export { OnHandCards }