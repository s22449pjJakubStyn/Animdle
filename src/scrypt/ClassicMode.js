import React, { useState } from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import '../styles/ClassicMode.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import information_sqr from '../img/information_sqr.png';
import form_button from '../img/form_button.png';
import shuriken_button from '../img/shuriken_button.png';
import { Link } from 'react-router-dom';
import characters from '../characters.json';
import ichigoImage from '../img/ichigo.png';
import narutoImage from '../img/naruto.png';
import ishidaImage from '../img/ishida.png';

const ClassicMode = () => {
    const [searchText, setSearchText] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const [images] = useState({
        1: ichigoImage,
        2: narutoImage,
        3: ishidaImage,
    });
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [isCharacterListVisible, setIsCharacterListVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(true);

    const handleSearchTextChange = (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text && text.trim()) {
            const trimmedText = text.trim();
            filterCharacters(trimmedText);
            setIsCharacterListVisible(true);
        } else {
            setCharacterList([]);
            setIsCharacterListVisible(false);
        }
    };

    const handleCharacterClick = (character) => {
        setSelectedCharacter(character.name);
        setSearchText(character.name);
        setIsCharacterListVisible(false);
        setIsEditable(true); // Ustawiamy isEditable na true po kliknięciu postaci
    };

    const handleTextFieldClick = () => {
        setIsEditable(true);
    };

    const filterCharacters = (text) => {
        const filteredList = characters.filter(
            (character) =>
                character.name.toLowerCase().startsWith(text.toLowerCase())
        );
        setCharacterList(filteredList);
    };

    const shouldDisplayCharacterList = searchText.trim() !== '';
    const noCharacterFound = shouldDisplayCharacterList && characterList.length === 0;

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            <div className="InformationContainer">
                <img src={information_sqr} className="InformationBox" alt="information box" />
                <div className="InformationText">Guess Anime character!</div>
                <div className="InformationDescription">Type any character to begin.</div>
            </div>
            <div className="FormContainer">
                <div className="FormBackground">
                    <img src={form_button} alt="form background" />
                </div>
                <form className="Form">
                    <div className="TextFieldContainer">
                        <input
                            type="text"
                            className="TextField"
                            placeholder="Type character name"
                            value={isEditable ? searchText : selectedCharacter}
                            onChange={handleSearchTextChange}
                            onClick={handleTextFieldClick}
                        />
                        <button type="submit" className="SubmitButton">
                            <img src={shuriken_button} alt="submit button" />
                        </button>
                    </div>
                </form>
                {shouldDisplayCharacterList && isCharacterListVisible && (
                    <div className="CharacterListContainer">
                        <div className="CharacterListBackground">
                            {noCharacterFound ? (
                                <div className="NoCharacterFound">No character found</div>
                            ) : (
                                characterList.map((character) => (
                                    <div
                                        key={character.id}
                                        className="CharacterItem"
                                        onClick={() => handleCharacterClick(character)} // Przekazujemy cały obiekt postaci
                                    >
                                        <div className="CharacterItemContent">
                                            <img
                                                src={images[character.id]}
                                                alt={character.name}
                                                className="CharacterItemImage"
                                            />
                                            <div className="CharacterItemName">{character.name}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassicMode;
