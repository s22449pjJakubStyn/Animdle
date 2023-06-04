import React from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import register_logo from '../img/register_logo.png';
import game_pannel2 from '../img/game_pannel2.png';
import { Link } from 'react-router-dom';
import ClassicMode from './ClassicMode';
import characters from '../characters.json';

const MainPage = () => {
    const getRandomCharacter = () => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    };
    return (
        <div className="App">
            <div className="Background" />
            <Link to="/"><img src={animdle_logo2} className="Logo" alt="logo" /></Link>
            <Link to="/classic"> <div className="GamePannelContainer">
                <img src={game_pannel2} className="GamePannel" alt="gamepannel2" />
                <div className="GamePannelText">Classic</div>
                <div className="GamePannelDescription"> Get clue on every try</div>
            </div></Link>
            <Link to="/register"><img src={register_logo} className="Register" alt="register_logo" /></Link>
        </div>
    );
};

export default MainPage;
