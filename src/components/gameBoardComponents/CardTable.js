import { Component } from "react";
import './CardTable.css'
import hpIcon from '../images/heart.png'
import costIcon from '../images/mana.png'
import attackIcon from '../images/sword.png'
import flames from '../images/flames.gif'
import { v4 as uuid } from 'uuid';

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
                <img className={'flames ' + this.props.id} src={flames} alt='flames'></img>
            </div>)
    }
}

export { CardTable }