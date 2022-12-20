import { Component } from "react";
import './Player.css'
import hpIcon from '../images/heart.png'
import costIcon from '../images/mana.png'

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
                <div className='player-spell' onClick={() => {
                    if ((this.props.hero.player === this.props.playerOnMove) && (this.props.hero.player === 'playerOne')) {
                        this.props.hero.skill()
                    }
                }}>{this.props.hero.skillName}</div>
            </div>
        )
    }
}

export { Player }