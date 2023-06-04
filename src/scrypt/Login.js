import React, {useContext, useState} from 'react';
import animdle_logo2 from '../img/animdle_logo2.png';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {toast, ToastContainer} from "react-toastify";
import { AuthContext } from './AuthContext';
import "../styles/App.css";
import "../styles/MainPage.css";
import "../styles/Login.css";
import register_logo from "../img/register_logo.png";

const Login = () => {
    const [error, setError] = useState(null);
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleSubmit = async (values, { resetForm }) => {
        const { email, password } = values;

        try {
            // Logowanie użytkownika w Firebase Authentication
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);

            toast.success("Poprawnie zalogowano!");
            setIsLoggedIn(true);
            resetForm(); // Zresetuj formularz po udanej rejestracji
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Niepoprawny adres email').required('Pole jest wymagane'),
        password: Yup.string().required('Pole jest wymagane'),
    });

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            <Link to="/register">
                <img src={register_logo} className="Register" alt="register_logo" />
            </Link>
            <h2 className="Title">Logowanie</h2>
            {error && <p className="ErrorMsg">{error}</p>}
            <div className="LoginContainer">
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="StyledForm">
                            <Field type="email" placeholder="Adres email" name="email" className="InputField" />
                            <ErrorMessage name="email" component="div" className="ErrorMsgField" />

                            <Field type="password" placeholder="Hasło" name="password" className="InputField" />
                            <ErrorMessage name="password" component="div" className="ErrorMsgField" />

                            <button type="submit" className="LoginSubmit">Zaloguj się</button>
                        </Form>
                    )}
                </Formik>
                <Link to="/register"> <p className="DontHaveAccount">Nie masz konta? Zarejestruj się!</p> </Link>

            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
