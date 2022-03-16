import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { React, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import { SurveyPage } from './pages/SurveyPage';
import CreateSurveyPage from './pages/CreateSurveyPage';
import MyNavbar from './components/Navbar';
import { API } from './API';
import { constants } from './utils/constants';
import { LoginContext, UserContext } from './contexts/contexts';


function App() {

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({ id: '', name: 'Guest User', email: '' });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const admin = await API.getUserInfo();
        setLogged(true);
        setUser(admin);
        <Redirect to={constants.URL_MAINPAGE} />
      } catch (err) {
        console.log(err.error);
      }
    };
    checkAuth();
  }, [logged]);

  return (
    <>
      <Router>
        <LoginContext.Provider value={{ logged, setLogged }}>
          <UserContext.Provider value={{ user, setUser }}>
            <MyNavbar />
            <Container fluid>

              <Switch>
                <Route exact path={constants.URL_LOGIN} render={() =>
                  <>{logged ? <Redirect to={constants.URL_MAINPAGE} /> : <LoginPage setUser={setUser} />}</>
                } />

                <Route exact path={constants.URL_SURVEY} render={() =>
                  <SurveyPage mode={constants.COMPILE_MODE}/>
                } />

                <Route exact path={constants.URL_RESULTS} render={() =>
                  <>{logged ? <SurveyPage mode={constants.RESULTS_MODE} /> : <Redirect to={constants.URL_MAINPAGE} />}</>
                } />

                <Route exact path={constants.URL_CREATE} render={() =>
                  <>{logged ? <CreateSurveyPage /> : <Redirect to={constants.URL_MAINPAGE} />}</>
                } />

                <Route exact path={constants.URL_MAINPAGE} render={() =>
                  <>{logged ? <Redirect to={constants.URL_ADMIN_MAINPAGE} /> : <MainPage user={user} />}</>
                } />

                <Route exact path={constants.URL_ADMIN_MAINPAGE} render={() =>
                  <>{logged ? <MainPage user={user} /> : <Redirect to={constants.URL_MAINPAGE} />}</>
                } />

                <Route path={constants.URL_ROOT} render={() =>
                  <>{logged ? <Redirect to={constants.URL_ADMIN_MAINPAGE} /> : <Redirect to={constants.URL_MAINPAGE} />} </>
                } />
              </Switch>
            </Container>
          </UserContext.Provider>
        </LoginContext.Provider>
      </Router>
    </>
  );
}

export default App;
