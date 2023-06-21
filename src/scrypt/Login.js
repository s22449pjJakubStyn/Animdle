import React, {useContext, useState} from 'react';
import animdle_logo2 from '../img/animdle_logo2.png';
import {Link} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {toast, ToastContainer} from "react-toastify";
import {AuthContext} from './AuthContext';
import "../styles/App.css";
import "../styles/MainPage.css";
import "../styles/Login.css";
import register_logo from "../img/register_logo.png";
import {getDatabase, ref, onValue, get, update} from "firebase/database";


const Login = () => {
    const [error, setError] = useState(null);
    const {isLoggedIn, setIsLoggedIn, setCurrentUser, setCurrentPoints, setCurrentNick, setCurrentName, setCurrentSurname, setCurrentPassword, setCurrentLevel} = useContext(AuthContext);

    const handleSubmit = async (values, {resetForm}) => {
        const {email, password} = values;

        try {
            // Logowanie użytkownika w Firebase Authentication
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const currentUserUID = userCredential.user.uid;

            // eslint-disable-next-line no-undef
            const database = getDatabase();
            const userRef = ref(database, `users/${currentUserUID}`);
            setCurrentUser(userCredential.user);
            toast.success("You have successfully logged in!");
            setIsLoggedIn(true);
            onValue(userRef, (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    setCurrentPoints(userData.points || 0);
                    setCurrentNick(userData.nickName);
                    setCurrentName(userData.firstName);
                    setCurrentSurname(userData.lastName);
                    setCurrentPassword(userData.password);
                    setCurrentLevel(userData.level)
                }
            });
            resetForm(); // Zresetuj formularz po udanej rejestracji
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Incorrect email address').required('The field is required'),
        password: Yup.string().required('The field is required\n'),
    });

    return (
        <div className="App">
            <div className="Background"/>
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo"/>
            </Link>
            {isLoggedIn ? (
                <div className="IsLogged"> Logged in, go to the home page</div>
            ) : (
                <div>
                    <Link to="/register">
                        <img src={register_logo} className="Register" alt="register_logo"/>
                    </Link>
                    <h2 className="Title">Login</h2>
                    {error && <p className="ErrorMsg">{error}</p>}
                    <div className="LoginContainer">
                        <Formik
                            initialValues={{email: '', password: ''}}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {() => (
                                <Form className="StyledForm">
                                    <Field type="email" placeholder="Adres email" name="email" className="InputField"/>
                                    <ErrorMessage name="email" component="div" className="ErrorMsgField"/>

                                    <Field type="password" placeholder="Password" name="password" className="InputField"/>
                                    <ErrorMessage name="password" component="div" className="ErrorMsgField"/>

                                    <button type="submit" className="LoginSubmit">Login</button>
                                </Form>
                            )}
                        </Formik>
                        <Link to="/register">
                            <p className="DontHaveAccount">You do not have an account? Register!</p>
                        </Link>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );

};

export default Login;