import { Component } from "react";
import './HeroPick.css'
import { v4 as uuid } from 'uuid';

class HeroPick extends Component {

    populateHeroes() {
        const heroes = this.props.heroes.map((hero) => {
            return <Card hero={hero} key={hero.name} />
        })
        return heroes
    }

    render() {
        return (
            <>
                <h1>Wybierz bohatera</h1>
                <div className="heropick-cards-container">
                    {this.populateHeroes()}
                </div>
            </>
        )
    }
}

class Card extends Component {
    constructor(props) {
        super(props)

        this.state = this.props.hero
    }

    render() {
        return (
            <div className="heropick-card">
                <div className="heropick-card-avatar"></div>
                <div className="heropick-card-text">
                    <p className="heropick-card-name">{this.state.name}</p>
                    <p className="heropick-card-description">{this.state.skillText}</p>
                </div>
            </div>
        )
    }
}

export { HeroPick }