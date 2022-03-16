import { useContext } from 'react';
import { Button, Card, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { LoginContext } from '../contexts/contexts';
import { cardSize, rounded, CFooter, CHeader, CTitle, CBody, badgeCounter } from '../styles/surveyCardStyle.js';
import { clipboardCheck } from '../assets/images';

import { constants } from '../utils/constants';

function SurveyCard(props) {

    const { logged } = useContext(LoginContext);

    return (
        <Card bg='info' text='white' style={cardSize}>
            <CHeader>
                <Col sm='10'>{clipboardCheck}<span style={{ marginLeft: '2%' }}>Survey</span>
                </Col>
                {logged ? <Col><Badge variant='light' style={badgeCounter}>{props.NoA}</Badge>
                </Col>
                : ''}
                </CHeader>
            <CBody>
                <CTitle>{props.title}</CTitle>
            </CBody>
            <CFooter>
                <Link to={{
                    pathname: logged ? constants.URL_RESULTS : constants.URL_SURVEY,
                    state: {id: props.id, surveyTitle: props.title}
                }} >
                    <Button variant='outline-light' disabled={props.NoA === 0 && logged ? true : false} style={rounded} >{logged ? 'Results' : 'Take survey'}</Button>
                </Link>
            </CFooter>
        </Card>

    );
}

export default SurveyCard;