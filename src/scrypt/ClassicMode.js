import React, {useContext, useEffect, useState} from 'react';
import '../styles/App.css';
import '../styles/MainPage.css';
import '../styles/ClassicMode.css';
import animdle_logo2 from '../img/animdle_logo2.png';
import information_sqr from '../img/information_sqr.png';
import form_button from '../img/form_button.png';
import shuriken_button from '../img/shuriken_button.png';
import {Link} from 'react-router-dom';
import characters from '../characters.json';
import {toast, ToastContainer} from "react-toastify";
import register_logo from "../img/register_logo.png";
import {AuthContext} from "./AuthContext";
import {get, getDatabase, ref, update} from "firebase/database";

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
        const [attempts, setAttempts] = useState(0);

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
        const {isLoggedIn, setIsLoggedIn, currentUser, currentPoints} = useContext(AuthContext);

        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [isYourPointsOpen, setIsYourPointsOpen] = useState(false);

        const handleMenuClick = () => {
            setIsMenuOpen(!isMenuOpen);
        };
        const handleYourPointsClick = () => {
            setIsYourPointsOpen(!isYourPointsOpen);
        };

        const handleLogout = () => {
            setIsLoggedIn(false);
        };

        useEffect(() => {
            // Zresetuj liczbę prób użytkownika przy wejściu do komponentu ClassicMode
            setAttempts(0);
        }, []);
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
        const checkGuess = async (guess, attempts, globalAttemptsRef) => {
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

                try {
                    const database = getDatabase();
                    const userRef = ref(database, `users/${currentUser.uid}`);
                    const snapshot = await get(userRef);
                    const userData = snapshot.val();
                    let updatedPoints = userData.points || 0; // Ustaw domyślną wartość punktów na 0, jeśli nie ma wartości lub wartość jest niepoprawna

                    // Dodaj odpowiednią liczbę punktów w zależności od liczby prób


                    if (!isNaN(updatedPoints)) {
                        if (attempts === 1) {
                            updatedPoints += 50; // 1 raz: 50 punktów
                            toast.success("Brawo przyznano ci 50 punktów!");
                            try {
                                const database = getDatabase();
                                const achievementRef = ref(database, `users/achievements/Achievement 1`);
                                const achievementSnapshot = await get(achievementRef);
                                const achievementData = achievementSnapshot.val();

                                // Sprawdź, czy osiągnięcie jeszcze nie zostało odblokowane przez użytkownika
                                if (!achievementData || !achievementData.userUID || !achievementData.userUID.includes(currentUser.uid)) {
                                    // Inicjalizuj tablicę userUID, jeśli nie istnieje
                                    if (!achievementData || !achievementData.userUID) {
                                        achievementData.userUID = [];
                                    }

                                    // Dodaj UID aktualnie zalogowanego użytkownika do pola 'userUID' osiągnięcia
                                    achievementData.userUID.push(currentUser.uid);

                                    // Zaktualizuj pole 'userUID' osiągnięcia w bazie danych
                                    await update(achievementRef, {userUID: achievementData.userUID});
                                    updatedPoints += 10; // 1 raz: 50 punktów
                                    toast.success("Brawo odblokowałeś osiągnięcie '🥵 Zapalony mangaka'! Przyznano ci 10 punktów");
                                }
                            } catch (error) {
                                console.error('Błąd podczas aktualizacji osiągnięcia', error);
                            }
                        }else if (attempts >= 2 && attempts <= 5 ) {
                            updatedPoints += 20; // 2-5 razy: 20 punktów
                            toast.success("Brawo przyznano ci 20 punktów!");

                        } else if (attempts > 5 && attempts <= 10) {
                            updatedPoints += 8; // 5-10 razy: 8 punktów
                            toast.success("Brawo przyznano ci 8 punktów!");
                        } else {
                            updatedPoints += 3; // Powyżej 10 prób: 3 punkty
                            toast.success("Brawo przyznano ci 3 punkty!");
                        }

                        // Zaktualizuj wartość punktów użytkownika w bazie danych
                        await update(userRef, {points: updatedPoints});
                    } else {
                        console.error('Nieprawidłowa wartość punktów użytkownika');
                    }
                } catch (error) {
                    console.error('Błąd podczas aktualizacji punktów użytkownika w bazie danych', error);
                }

            }
            setUserAnswer((prevUserAnswer) => [
                ...prevUserAnswer,
                {guess, isCorrect, character: userCharacterObject},
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
                setAttempts((attempts) => attempts + 1); // Zwiększ liczbę prób
                checkGuess(searchText, attempts + 1);
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
            setAttempts(0);
            setSubmittedCharacters([]);
            setIsGuessCorrect(null);
            setUserAnswer([]);
            setIsEditable(true);
            const getRandomCharacter = () => {
                const randomIndex = Math.floor(Math.random() * characters.length);
                return characters[randomIndex];
            };

            const character = getRandomCharacter();
            setRandomCharacter(character);
        };

        useEffect(() => {
            const getRandomCharacter = () => {
                const randomIndex = Math.floor(Math.random() * characters.length);
                return characters[randomIndex];
            };

            const character = getRandomCharacter();
            setRandomCharacter(character);
        }, []);


        const unlockAchievement = async () => {
            try {
                const database = getDatabase();
                const userRef = ref(database, `users/${currentUser.uid}`);
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                let updatedPoints = userData.points || 0;
                if (!isNaN(updatedPoints)) {
                    try {
                        const database = getDatabase();
                        const achievementRef = ref(database, `users/achievements/Achievement 2`);
                        const achievementSnapshot = await get(achievementRef);
                        const achievementData = achievementSnapshot.val();

                        // Sprawdź, czy osiągnięcie jeszcze nie zostało odblokowane przez użytkownika
                        if (!achievementData || !achievementData.userUID || !achievementData.userUID.includes(currentUser.uid)) {
                            // Inicjalizuj tablicę userUID, jeśli nie istnieje
                            if (!achievementData || !achievementData.userUID) {
                                achievementData.userUID = [];
                            }

                            // Dodaj UID aktualnie zalogowanego użytkownika do pola 'userUID' osiągnięcia
                            achievementData.userUID.push(currentUser.uid);

                            // Zaktualizuj pole 'userUID' osiągnięcia w bazie danych
                            await update(achievementRef, {userUID: achievementData.userUID});
                            updatedPoints += 10; // 1 raz: 50 punktów
                            toast.success("Brawo odblokowałeś osiągnięcie '🤯 Ile?!'! Przyznano ci 10 punktów");
                        }
                    } catch (error) {
                        console.error('Błąd podczas aktualizacji osiągnięcia', error);
                    }
                    await update(userRef, {points: updatedPoints});
                } else {
                    console.error('Nieprawidłowa wartość punktów użytkownika');
                }
            } catch (error) {
                console.error('Błąd podczas aktualizacji punktów użytkownika w bazie danych', error);
            }
        };

        useEffect(() => {
            if (currentPoints >= 100) {
                unlockAchievement();
            }
        }, [currentPoints]);

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
                    style={{backgroundColor: squareColor}}
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
                            <img src={`/images/${userCharacterObject.name.toLowerCase()}.png`}
                                 alt={userCharacterObject.name}
                                 className="GuessImage"/>
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
                <div className="Background"/>
                <Link to="/">
                    <img src={animdle_logo2} className="Logo" alt="logo"/>
                </Link>
                <div className="AttemptsCounter">Attempts: {attempts}</div>
                {attempts >= 5 && randomCharacter.hintEasy && (
                    <div className="Hint">Little hint: {randomCharacter.hintEasy}</div>
                )}
                {attempts >= 10 && randomCharacter.hintHard && (
                    <div className="Hint">Big hint: {randomCharacter.hintHard}</div>
                )}
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
                        <img src={form_button} alt="form background"/>
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
                                    <img src={shuriken_button} alt="submit button"/>
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
                {isLoggedIn ? (
                    <div>
                        <button className="UserName" onClick={handleMenuClick}>
                            Ohayo {currentUser.email}
                        </button>
                        {isMenuOpen && (
                            <div className="Menu">
                                <button className="MenuItem" onClick={handleYourPointsClick}>
                                    Your Points
                                </button>
                                {isYourPointsOpen && (
                                    <div className="YourPoints">Points: {currentPoints}</div>
                                )}
                                <Link to="/ranking">
                                    <button className="MenuItem"> Players Ranking</button>
                                </Link>
                                <Link to="/achievements">
                                    <button className="MenuItem"> Your Achievements</button>
                                </Link>
                            </div>
                        )}
                        <button onClick={handleLogout} className="Logout">Wyloguj się</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/register">
                            <img src={register_logo} className="Register" alt="register_logo"/>
                        </Link>
                    </div>
                )}
                <ToastContainer/>
            </div>
        );
    }
;

export default ClassicMode;