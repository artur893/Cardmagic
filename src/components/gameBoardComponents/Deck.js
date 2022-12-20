import { Component } from "react";
import './Deck.css'
import { v4 as uuid } from 'uuid';
import cardReverse from '../images/cardReverse.jpg'
import hpIcon from '../images/heart.png'
import costIcon from '../images/mana.png'
import attackIcon from '../images/sword.png'

class Deck extends Component {

    isNextCard() {
        if (this.props.hero.nextCard) {
            return 1
        } else {
            return 0
        }
    }

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
                <div className="deck-left">Cards left:&nbsp;{this.props.hero.cards.length + this.isNextCard()}</div>
            </div>)
    }
}

export {Deck}