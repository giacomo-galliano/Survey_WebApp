import { React, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Spinner, Button, Row } from 'react-bootstrap';
import { Redirect } from 'react-router';

import { QAPrinter } from '../components/QAPrinter';
import { Container, QuestionGrid, TitleBox, btnStyle, pageToggle } from '../styles/surveyPageStyle';
import { API } from '../API';
import { arrowLeft, arrowRight } from '../assets/images';
import { constants } from '../utils/constants';
import { LoginContext } from '../contexts/contexts';


function getUnique(arr, key) {
    return [...new Map(arr.map(i => [i[key], { idQuestion: i.idQuestion, min: i.min, max: i.max, question: i.question }])).values()]
}

function getCleanAns(v, logged) {
    return v.map((el) => ({ idQuestion: el.idQuestion, idAnswer: el.idAnswer, answer: el.answer, selected: (logged ? el.selected : false) }));
}

function SurveyPage(props) {

    const { logged } = useContext(LoginContext);

    /*  QUESTIONS
        [
            {idQuestion: .. ,
            min: .. ,
            max: .. , 
            question: ..}
            ...
            ...
        ]
    */
    const [questions, setQuestions] = useState([]);

    /* ANSWERS
    [
        {idQuestion: .. ,
        idAnswer: .. ,
        answer: .. , 
        selected: false}
        ...
        ...
    ]
*/
    const [answers, setAnswers] = useState([]);

    /*  RESULTS
    [
        {
        idGuest: .. ,
        idSurvey: .. ,
        guestName: .. ,
        results: {idQuestion: .. , 
                idAnswer: .. , 
                answer: .. ,
                selected: ..
                ...
                ...
                }
        }
        ...
        ...
    ]
    */
    const [results, setResults] = useState([]);

    const [guestName, setGuestName] = useState('');
    const [guestIndex, setGuestIndex] = useState(0);

    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [showErr, setShowErr] = useState(false);
    const [errors, setErrors] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    const initErrors = (n) => {
        const tmp = [];
        for (var i = 0; i <= n; i++) {
            tmp.push(0);
        }
        setErrors(tmp);
    }

    const checkValidation = () => {
        setShowErr(false);

        const checkEr = [];
        guestName === '' ? checkEr[0] = 1 : checkEr[0] = 0;

        questions.map((qst) => {
            var resCounter = answers.filter((ans) => ans.idQuestion === qst.idQuestion && ans.selected !== false).length;
            (resCounter >= qst.min && resCounter <= qst.max) ? checkEr[qst.idQuestion] = 0 : checkEr[qst.idQuestion] = 1
        })

        if (checkEr.some((n) => n === 1)) {
            setErrors(checkEr);
            setShowErr(true);
            return false;
        } else {
            return true;
        }

    }

    const handleSwipeLeft = () => {
        if (guestIndex === 0) {
            setGuestIndex(results.length - 1);
            setGuestName(results[results.length - 1].guestName);
            setAnswers(results[results.length - 1].results);
        } else {
            setGuestIndex(guestIndex - 1);
            setGuestName(results[guestIndex - 1].guestName);
            setAnswers(results[guestIndex - 1].results);
        }
    }

    const handleSwipeRight = () => {
        if (guestIndex === results.length - 1) {
            setGuestIndex(0);
            setGuestName(results[0].guestName);
            setAnswers(results[0].results);
        } else {
            setGuestIndex(guestIndex + 1);
            setGuestName(results[guestIndex + 1].guestName);
            setAnswers(results[guestIndex + 1].results);
        }
    }

    const handleSubmit = (event) => {
        if (checkValidation() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (checkValidation() === true) {
            event.preventDefault();
            event.stopPropagation();
            const result = { surveyId: location.state.id, guestName: guestName, results: [...answers] };
            API.setResults(result);

            setSubmitted(true);
        }
    }

    useEffect(() => {
        const loadQandA = async () => {
            const QandA = await API.loadQABySurvey(location.state.id)
            const filteredQst = getUnique(QandA, 'idQuestion');
            setQuestions(filteredQst);
            const filteredAns = getCleanAns(QandA);
            setAnswers(filteredAns);
            initErrors(filteredQst.length);
            setLoading(false);
        }

        const loadQandRes = async () => {
            const QandA = await API.loadQABySurvey(location.state.id)
            const filteredQst = getUnique(QandA, 'idQuestion');
            setQuestions(filteredQst);
            const res = await API.loadQRBySurvey(location.state.id);

            setResults(res);
            setGuestName(res[guestIndex].guestName)
            setAnswers(res[guestIndex].results);
            setLoading(false);
        }

        if (loading && location.state !== undefined) {
            if (props.mode === constants.RESULTS_MODE) {
                loadQandRes().catch(err =>
                    console.log(err));
            }
            loadQandA().catch(err =>
                console.log(err));
        }


    }, []);

    return (<>{submitted || location.state === undefined ? <Redirect to={constants.URL_MAINPAGE} /> :
        <Container>
            <TitleBox>
                {location.state.surveyTitle}
            </TitleBox>
            {loading ? <Spinner animation="border" variant="info" />
                : <>
                    <QuestionGrid>
                        {logged ?
                            <QAPrinter questions={questions} answers={answers} handleSwipeLeft={handleSwipeLeft} handleSwipeRight={handleSwipeRight} guestName={guestName} maxChar='200' mode={props.mode} />
                            : <QAPrinter questions={questions} answers={answers} setAnswers={setAnswers} errors={errors} showErr={showErr} setGuestName={setGuestName} maxChar='200' mode={props.mode} />
                        }
                    </QuestionGrid>
                    {logged ? <>
                        <Row >
                            <span style={pageToggle} onClick={() => handleSwipeLeft()} >{arrowLeft}</span>
                            <span style={{margin: '0.4rem'}}>{guestIndex+1}</span>
                            <span style={pageToggle} onClick={() => handleSwipeRight()} >{arrowRight}</span>
                        </Row>
                    </> : <Button variant='success' onClick={(ev) => handleSubmit(ev)} style={btnStyle}>Submit</Button>}
                </>}
        </Container>
    }</>
    );

}

export { SurveyPage, getUnique, getCleanAns };