import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import '../styles/ClassicMode.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import information_sqr from '../img/information_sqr.png';
import form_button from '../img/form_button.png';
import shuriken_button from '../img/shuriken_button.png';
import { Link } from 'react-router-dom';
import characters from '../characters.json';

const ClassicMode = () => {
    const [randomCharacter, setRandomCharacter] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const imageBaseUrl = 'images/';
    const images = characterList.reduce((obj, character) => {
        obj[character.id] = `${imageBaseUrl}${character.image}`;
        return obj;
    }, {});
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [isCharacterListVisible, setIsCharacterListVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [isGuessCorrect, setIsGuessCorrect] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [userCharacter, setUserCharacter] = useState('');
    const [userCharacterList, setUserCharacterList] = useState([]);
    const userCharacterObject = characters.find(
        (character) => character.name.toLowerCase() === userCharacter.toLowerCase()
    );

    if (userCharacterObject) {
        userCharacterObject.anime = userCharacterObject.anime.toString();
        userCharacterObject.gender = userCharacterObject.gender.toString();
        userCharacterObject.age = userCharacterObject.age.toString();
        userCharacterObject.priority = userCharacterObject.priority.toString();
        userCharacterObject.species = userCharacterObject.species.toString();
        userCharacterObject.status = userCharacterObject.status.toString();
    }
    const [userAnswer, setUserAnswer] = useState([]);
    const [submittedCharacters, setSubmittedCharacters] = useState([]);


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
        setIsEditable(true);
    };

    const handleTextFieldClick = () => {
        setIsEditable(true);
    };

    const isCharacterValid = (text) => {
        return characters.some(
            (character) => character.name.toLowerCase() === text.toLowerCase()
        );
    };

    const checkGuess = (guess) => {
        const isCorrect = randomCharacter.name.toLowerCase() === guess.toLowerCase();
        setIsGuessCorrect(isCorrect);
        setIsEditable(!isCorrect); // Blokujemy edycję, jeśli odgadnięto postać

        if (isCorrect) {
            // Odgadnięto postać
            setUserCharacter(guess);
            setUserCharacterList((prevUserCharacterList) => [
                ...prevUserCharacterList,
                userCharacterObject,
            ]);
        }

        setUserAnswer((prevUserAnswer) => [
            ...prevUserAnswer,
            { guess, isCorrect, character: userCharacterObject },
        ]);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const userInput = e.target.querySelector('.TextField').value;
        const isCharacterSubmitted = submittedCharacters.some(
            (character) => character && character.name && character.name.toLowerCase() === userInput.toLowerCase()
        );


        if (isCharacterSubmitted) {
            // Postać już została przesłana
            alert('Ta postać została już przesłana.');
        } else {
            // Postać nie została jeszcze przesłana
            checkGuess(searchText);
            setSubmitted(true);
            setIsEditable(false);
            setUserCharacter(userInput);
            setSearchText('');
            const isGuessCorrect = searchText.toLowerCase() === randomCharacter.name.toLowerCase();

            // Tworzymy obiekt reprezentujący przesłaną postać
            const userCharacterObject = {
                name: userInput,
                isCorrect: isGuessCorrect,
            };

            // Dodajemy przesłaną postać do tablicy submittedCharacters
            setSubmittedCharacters([...submittedCharacters, userCharacterObject]);

            e.target.reset();
        }
    };

    const playAgain = () => {
        window.location.reload();

    };

    useEffect(() => {
        const getRandomCharacter = () => {
            const randomIndex = Math.floor(Math.random() * characters.length);
            return characters[randomIndex];
        };

        const character = getRandomCharacter();
        setRandomCharacter(character);
    }, []);

    const filterCharacters = (text) => {
        const filteredList = characters.filter(
            (character) =>
                character.name.toLowerCase().startsWith(text.toLowerCase())
        );
        setCharacterList(filteredList);
    };

    const shouldDisplayCharacterList = searchText.trim() !== '';
    const noCharacterFound =
        shouldDisplayCharacterList && characterList.length === 0;

    const renderInfoSquare = (label, value, isCorrect, squareColor) => {
        const squareClass = isCorrect ? 'InfoSquareGreen' : 'InfoSquareRed';

        return (
            <div
                className={`InfoSquare ${squareClass}`}
                style={{ backgroundColor: squareColor }}
            >
                <div className="InfoSquareLabel">{label}</div>
                <div className="InfoSquareValue">{value}</div>
            </div>
        );
    };

    const renderCharacterInfo = () => {
        let nameSquareColor;
        let animeSquareColor;
        let genderSquareColor;
        let prioritySquareColor;
        let speciesSquareColor;
        let ageSquareColor;
        let statusSquareColor;
        let isNameCorrect = false;
        let isAnimeCorrect = false;
        let isGenderCorrect = false;
        let isPriorityCorrect = false;
        let isSpeciesCorrect = false;
        let isAgeCorrect = false;
        let isStatusCorrect = false;

        if (userCharacterObject) {
            if (
                (isNameCorrect =
                    userCharacterObject.name.toString() ===
                    randomCharacter.name.toString())
            ) {
                nameSquareColor = 'green';
            }
            if (
                (isGenderCorrect =
                    userCharacterObject.gender.toString() ===
                    randomCharacter.gender.toString())
            ) {
                genderSquareColor = 'green';
            }
            if (
                (isAnimeCorrect =
                    userCharacterObject.anime.toString() ===
                    randomCharacter.anime.toString())
            ) {
                animeSquareColor = 'green';
            }
            if (
                (isAgeCorrect =
                    userCharacterObject.age.toString() ===
                    randomCharacter.age.toString())
            ) {
                ageSquareColor = 'green';
            }
            if (
                (isPriorityCorrect =
                    userCharacterObject.priority.toString() ===
                    randomCharacter.priority.toString())
            ) {
                prioritySquareColor = 'green';
            }
            if (
                (isSpeciesCorrect =
                    userCharacterObject.species.toString() ===
                    randomCharacter.species.toString())
            ) {
                speciesSquareColor = 'green';
            }
            if (
                (isStatusCorrect =
                    userCharacterObject.status.toString() ===
                    randomCharacter.status.toString())
            ) {
                statusSquareColor = 'green';
            }
        }

        const infoData = [
            {
                label: '',
                value: (
                    <div>
                        <img src={`/images/${userCharacterObject.name.toLowerCase()}.png`} alt={userCharacterObject.name} className="GuessImage"/>
                    </div>
                ),

                isCorrect: isNameCorrect,
                squareColor: 'transparent',
            },
            {
                label: 'Name',
                value: userCharacterObject.name,
                isCorrect: isNameCorrect,
                squareColor: nameSquareColor,
            },
            {
                label: 'Anime',
                value: userCharacterObject.anime,
                isCorrect: isAnimeCorrect,
                squareColor: animeSquareColor,
            },
            {
                label: 'Gender',
                value: userCharacterObject.gender,
                isCorrect: isGenderCorrect,
                squareColor: genderSquareColor,
            },
            {
                label: 'Priority',
                value: userCharacterObject.priority,
                isCorrect: isPriorityCorrect,
                squareColor: prioritySquareColor,
            },
            {
                label: 'Species',
                value: userCharacterObject.species,
                isCorrect: isSpeciesCorrect,
                squareColor: speciesSquareColor,
            },
            {
                label: 'Age',
                value: userCharacterObject.age,
                isCorrect: isAgeCorrect,
                squareColor: ageSquareColor,
            },
            {
                label: 'Status',
                value: userCharacterObject.status,
                isCorrect: isStatusCorrect,
                squareColor: statusSquareColor,
            },
        ];

        return (
            <div className="InfoSquaresContainer">
                {infoData.map((info, index) => (
                    <div key={index} className="UserCharacterInfo">
                        {renderInfoSquare(
                            info.label,
                            info.value,
                            info.isCorrect,
                            info.squareColor
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            <div className="InformationContainer">
                <img
                    src={information_sqr}
                    className="InformationBox"
                    alt="information box"
                />
                <div className="InformationText">Guess Anime character!</div>
                <div className="InformationDescription">
                    Type any character to begin.
                </div>
            </div>
            <div className="FormContainer">
                <div className="FormBackground">
                    <img src={form_button} alt="form background" />
                </div>
                {!isGuessCorrect ? (
                    <form className="Form" onSubmit={handleSubmit}>
                        <div className="TextFieldContainer">
                            <input
                                type="text"
                                className="TextField"
                                placeholder="Type character name"
                                value={searchText}
                                onChange={handleSearchTextChange}
                                onClick={handleTextFieldClick}
                            />
                            <button
                                type="submit"
                                className="SubmitButton"
                                disabled={!isCharacterValid(searchText)}
                            >
                                <img src={shuriken_button} alt="submit button" />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="GameResult">
                        <button className="PlayAgainButton" onClick={playAgain}>
                            Zagraj jeszcze raz
                        </button>
                    </div>
                )}

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
                                        onClick={() => handleCharacterClick(character)}
                                    >
                                        <div className="CharacterItemContent">
                                            <img
                                                src={images[character.id]}
                                                alt={character.name}
                                                className="CharacterItemImage"
                                            />
                                            <div className="CharacterItemName">
                                                {character.name}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {isGuessCorrect !== null && (
                <div className="GuessResult">
                    {isGuessCorrect ? (
                        <div className="GuessCorrect">
                            Congratulations! You guessed the character!
                        </div>
                    ) : (
                        <div className="GuessIncorrect">Oops! Your guess is incorrect.</div>
                    )}
                    {renderCharacterInfo()}
                </div>
            )}
        </div>
    );
};

export default ClassicMode;
