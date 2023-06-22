import React, {useContext, useState} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
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
import {AuthContext} from "./AuthContext";
import setting from "../img/setting.png";
initializeApp(firebaseConfig);

const Register = () => {
    const { isLoggedIn} = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const togglePanel = () => {
        setIsPanelVisible(!isPanelVisible);
    };
    const handleSubmit = async (values, { resetForm }) => {
        const { email, password, fName, lName, points, nickName, level } = values;

        try {
            // Rejestracja użytkownika w Firebase Authentication
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid; // Pobierz UID nowo utworzonego użytkownika

            // Zapisywanie danych użytkownika w Firebase Realtime Database
            const database = getDatabase();
            const userRef = ref(database, 'users/' + uid); // Użyj UID jako ścieżki referencji
            const newUser = {
                email: email,
                password: password,
                firstName: fName,
                lastName: lName,
                points: points,
                nickName: nickName,
                level: level
                // inne dane użytkownika, np. imię, nazwisko itp.
            };
            await set(userRef, newUser);

            toast.success("Successful registration!");
            resetForm(); // Zresetuj formularz po udanej rejestracji
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Incorrect email address").required("Pole jest wymagane"),
        password: Yup.string()
            .required("The field is required")
            .min(8, "The password must be at least 8 characters long")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{8,}$/,
                "The password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character"
            ),
        fName: Yup.string()
            .required("The field is required")
            .min(3, "First name must be at least 3 characters long")
            .max(20, "The name can be up to 20 characters long"),
        lName: Yup.string()
            .required("The field is required")
            .min(3, "Last name must be at least 3 characters long")
            .max(20, "The last name can be up to 20 characters long"),
        nickName: Yup.string()
            .required("The field is required")
            .min(3, "Nick must be at least 3 characters long")
            .max(30, "Nickname can be up to 30 characters long"),
    });

    return (
        <div className="App">
            <div className="Background" />
            <Link to="/">
                <img src={animdle_logo2} className="Logo" alt="logo" />
            </Link>
            <div className="RulesButton">
                <img src={setting} className="" alt="Settings" onClick={togglePanel}/>
                {isPanelVisible && (
                    <div className="RulesPanel">
                        To correct register make sure that:
                        <br/>-Your email has correct format (a@.pl)
                        <br/>-Your password is 8 characters long with 1 big and small letter, 1 number and 1 special char
                        <br/>-Your name, surname and nick has at least 3 letters
                        <br/><br/>Enjoy ❤️
                    </div>
                )}
            </div>
            {isLoggedIn ? (
                <div className="IsLogged"> You are logged go to mainpage</div>
            ) : (
                <div>
                    <Link to="/register">
                        <img src={register_logo} className="Register" alt="register_logo" />
                    </Link>
                    <h2 className="Title">Registration</h2>
                    {error && <p className="ErrorMsg">{error}</p>}
                    <div className="RegisterContainer">
                        <Formik
                            initialValues={{ email: '', password: '', fName: '', lName: '', points: 0, nickName: '', level: 1 }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ resetForm }) => (
                                <Form className="StyledForm">
                                    <Field type="email" placeholder="Email" name="email" className="InputField" />
                                    <ErrorMessage name="email" component="div" className="ErrorMsgField" />

                                    <Field type="password" placeholder="Password" name="password" className="InputField" />
                                    <ErrorMessage name="password" component="div" className="ErrorMsgField" />

                                    <Field type="text" placeholder="Name" name="fName" className="InputField" />
                                    <ErrorMessage name="fName" component="div" className="ErrorMsgField" />

                                    <Field type="text" placeholder="Surname" name="lName" className="InputField" />
                                    <ErrorMessage name="lName" component="div" className="ErrorMsgField" />
                                    <Field type="text" placeholder="Nick" name="nickName" className="InputField" />
                                    <ErrorMessage name="nickName" component="div" className="ErrorMsgField" />

                                    <button type="submit" className="RegisterSubmit">
                                        Register
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <Link to="/login">
                            <p className="Login">Already have an account? Log in!</p>
                        </Link>
                    </div>
                </div>
            )}
            <ToastContainer /> {/* Kontener dla powiadomień */}
        </div>
    );

};

export default Register;