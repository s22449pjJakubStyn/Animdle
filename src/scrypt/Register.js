import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebaseConfig";
import { Link } from "react-router-dom";
import animdle_logo2 from "../img/animdle_logo2.png";
import "../styles/App.css";
import "../styles/MainPage.css";
import "../styles/Register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import register_logo from "../img/register_logo.png";
initializeApp(firebaseConfig);

const Register = () => {
    const [error, setError] = useState(null);

    const handleSubmit = async (values, { resetForm }) => {
        const { email, password, fName, lName } = values;

        try {
            // Rejestracja użytkownika w Firebase Authentication
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);

            // Zapisywanie danych użytkownika w Firebase Realtime Database
            const database = getDatabase();
            const userRef = ref(database, "users");
            const newUser = {
                email: email,
                firstName: fName,
                lastName: lName,
                // inne dane użytkownika, np. imię, nazwisko itp.
            };
            await push(userRef, newUser);

            toast.success("Rejestracja zakończona sukcesem!");
            resetForm(); // Zresetuj formularz po udanej rejestracji
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Niepoprawny adres email").required("Pole jest wymagane"),
        password: Yup.string()
            .required("Pole jest wymagane")
            .min(8, "Hasło musi mieć co najmniej 8 znaków")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{8,}$/,
                "Hasło musi zawierać co najmniej 1 małą literę, 1 dużą literę, 1 cyfrę i 1 znak specjalny"
            ),
        fName: Yup.string()
            .required("Pole jest wymagane")
            .min(3, "Imię musi mieć co najmniej 3 znaki")
            .max(20, "Imię może mieć maksymalnie 20 znaków"),
        lName: Yup.string()
            .required("Pole jest wymagane")
            .min(3, "Nazwisko musi mieć co najmniej 3 znaki")
            .max(20, "Nazwisko może mieć maksymalnie 20 znaków"),
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
            <h2 className="Title">Rejestracja</h2>
            {error && <p className="ErrorMsg">{error}</p>}
            <div className="RegisterContainer">
                <Formik
                    initialValues={{ email: "", password: "", fName: "", lName: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ resetForm }) => (
                        <Form className="StyledForm">
                            <Field type="email" placeholder="Adres email" name="email" className="InputField" />
                            <ErrorMessage name="email" component="div" className="ErrorMsgField" />

                            <Field type="password" placeholder="Hasło" name="password" className="InputField" />
                            <ErrorMessage name="password" component="div" className="ErrorMsgField" />

                            <Field type="text" placeholder="Imię" name="fName" className="InputField" />
                            <ErrorMessage name="fName" component="div" className="ErrorMsgField" />

                            <Field type="text" placeholder="Nazwisko" name="lName" className="InputField" />
                            <ErrorMessage name="lName" component="div" className="ErrorMsgField" />

                            <button type="submit" className="RegisterSubmit">
                                Zarejestruj się
                            </button>
                        </Form>
                    )}
                </Formik>
                <Link to="/login">  <p className="Login">Masz już konto? Zaloguj się!</p></Link>
            </div>
            <ToastContainer /> {/* Kontener dla powiadomień */}
        </div>
    );
};

export default Register;
