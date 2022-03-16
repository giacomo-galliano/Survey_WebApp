import { React, useState, useContext, useEffect } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import SurveyCard from '../components/SurveyCard';
import { LoginContext } from '../contexts/contexts';
import { ContainerSurveys, SurveyGrid, TitleBox } from '../styles/mainPageStyle';
import { clipboardPlus } from '../assets/images';
import { constants } from '../utils/constants';
import { API } from '../API';

function MainPage(props) {

    const { logged } = useContext(LoginContext);

    const [surveys, setSurveys] = useState([]);

    const [loading, setLoading] = useState(true); 
    const [dirty, setDirty] = useState(true); 

    useEffect(() => {
        if (logged) {
            if (dirty) {
                API.loadSurveysByAdmin().then(newSr => {
                    setSurveys(newSr);
                    setLoading(false);
                    setDirty(false);
                })
            }
        } else {
            if (dirty) {
                API.loadSurveys().then(newSr => {
                    setSurveys(newSr);
                    setLoading(false);
                    setDirty(false);
                })
            }
        }
    }, [dirty]);    


    return (<>

        <ContainerSurveys>
            <TitleBox>ACTIVE SURVEYS{logged ? <>{' | '}
                <Link to={{
                    pathname: constants.URL_CREATE
                }}>
                    <Button variant='info' style={{ borderRadius: '25px', paddingBottom: '1%' }}>{clipboardPlus} Create a new survey </Button>
                </Link>
            </> : ''}</TitleBox>
            {loading ? <>
                <Spinner animation="border" variant="info" />
            </> : <SurveyGrid>
                {surveys.map((s) => (
                    <SurveyCard key={s.id} id={s.id} title={s.title} NoA={s.NoA}>
                    </SurveyCard>
                ))}
            </SurveyGrid>}

        </ContainerSurveys>
    </>
    );
}

export default MainPage;