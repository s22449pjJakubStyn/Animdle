import {Link} from "react-router-dom";
import animdle_logo2 from "../img/animdle_logo2.png";
import '../styles/App.css';
import '../styles/MainPage.css';
import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
const Register = () => {
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };

    const handleSubmit = (values) => {
        // Wywołaj tutaj odpowiednią logikę rejestracji użytkownika
        console.log(values);
    };

    const validateForm = (values) => {
        const errors = {};

        if (!values.firstName) {
            errors.firstName = 'Pole Imię jest wymagane';
        }

        if (!values.lastName) {
            errors.lastName = 'Pole Nazwisko jest wymagane';
        }

        if (!values.email) {
            errors.email = 'Pole Email jest wymagane';
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            errors.email = 'Nieprawidłowy format adresu email';
        }

        if (!values.password) {
            errors.password = 'Pole Hasło jest wymagane';
        } else if (values.password.length < 6) {
            errors.password = 'Hasło musi mieć co najmniej 6 znaków';
        }

        return errors;
    };
return (
    <div className="App">
        <div className="Background" />
        <Link to="/">
            <img src={animdle_logo2} className="Logo" alt="logo" />
        </Link>
        <h2>Rejestracja</h2>
        <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
        >
            <Form>
                <div>
                    <label htmlFor="firstName">Imię:</label>
                    <Field type="text" id="firstName" name="firstName" />
                    <ErrorMessage name="firstName" component="div" />
                </div>

                <div>
                    <label htmlFor="lastName">Nazwisko:</label>
                    <Field type="text" id="lastName" name="lastName" />
                    <ErrorMessage name="lastName" component="div" />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <Field type="email" id="email" name="email" />
                    <ErrorMessage name="email" component="div" />
                </div>

                <div>
                    <label htmlFor="password">Hasło:</label>
                    <Field type="password" id="password" name="password" />
                    <ErrorMessage name="password" component="div" />
                </div>

                <button type="submit">Zarejestruj</button>
            </Form>
        </Formik>
    </div>
);
};