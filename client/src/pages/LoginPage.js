import { useState, useContext } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';

import { API } from '../API';
import { LoginContext, UserContext } from '../contexts/contexts';
import { SignInContainer } from '../styles/loginPageStyle.js';

function isAlphaNumeric(str) {
    var code, i, len, nNum = 0, nLett = 0;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (code > 47 && code < 58) {
            nNum++;
        }
        if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
            nLett++;
        }
    }
    if (nNum === 0 || nLett === 0) {
        return false;
    }
    return true;
};

function LoginPage(props) {

    const { setLogged } = useContext(LoginContext);
    const { setUser } = useContext(UserContext);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);

    const [errShow, setErrShow] = useState(false);

    const handleLogin = async (credentials) => {
        try {
            const user = await API.login(credentials);
            setLogged(true);
            setUser(user);
        } catch (err) {
            setError('Wrong email or password! Try again');
            setErrShow(true);
        }
    }

    const handleSubmit = (event) => {

        if (event.currentTarget.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }

        if (event.currentTarget.checkValidity() === true) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(false);

            const credentials = { username: username, password: password };

            var valid;

            if (username === '' || password === '' || password.length < 6 || isAlphaNumeric(password) === false) {

                valid = false;
                setErrShow(true);
            } else {
                valid = true;
            }
            if (valid) {
                handleLogin(credentials);

            }
        }
    }


    return (
        <SignInContainer>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <h2>Login</h2>

                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="email" placeholder="Insert your email" onChange={ev => { setUsername(ev.target.value); setErrShow(false) }} />
                    <Form.Control.Feedback type="invalid">
                        Please insert a valid email.
                        </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder='Insert your password' onChange={(ev) => { setPassword(ev.target.value); setErrShow(false) }} />
                </Form.Group>

                {errShow ? <Alert variant='danger' className='error-box' onClose={() => (setErrShow(false))} dismissible>
                    <Alert.Heading>{error}</Alert.Heading>
                    <p>The password must be at least 6 characters long and must contain both alphabetical and numerical values.</p>
                </Alert>
                    : ''}

                <Button variant="info" type="submit" style={{ borderRadius: '25px' }}>Sign in</Button>

            </Form>
        </SignInContainer>

    );
}

export default LoginPage;