import { Component } from "react";
import './HeroPick.css'

class HeroPick extends Component {

    populateHeroes() {
        const heroes = this.props.heroes.map((hero) => {
            return <Card hero={hero} key={hero.name} pickHero={this.props.pickHero} />
        })
        return heroes
    }

    render() {
            if (this.props.activeView === 'heroPick') {
                return (
                    <>
                        <h1 className="heropick-h1">Wybierz bohatera</h1>
                        <div className="heropick-cards-container">
                            {this.populateHeroes()}
                        </div>
                    </>
                )
            }
    }
}

class Card extends Component {
    constructor(props) {
        super(props)

        this.state = this.props.hero
    }

    render() {
        return (
            <div className="heropick-card" onClick={() => this.props.pickHero(this.state)}>
                <p className="heropick-card-name">{this.state.name}</p>
                <div className="heropick-card-avatar"><img src={this.state.icon} alt={this.state.name}></img></div>
                <p className="heropick-card-description">{this.state.skillText}</p>
            </div>
        )
    }
}

export { HeroPick }