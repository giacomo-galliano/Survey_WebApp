import { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';

import { UserContext } from '../contexts/contexts';
import { QAPrinter } from '../components/QAPrinter';
import { CreationModal } from '../components/CreationModal';
import { Container, QuestionGrid, ButtonsGrid, titleInput, rounded } from '../styles/createSurveyPageStyle';
import { plusCircle, clipboardPlus } from '../assets/images';
import { constants } from '../utils/constants';
import { API } from '../API';
import { Redirect } from 'react-router';

function CreateSurveyPage() {

    const { user } = useContext(UserContext);

    const [show, setShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [qstCount, setQstCount] = useState(0);
    const [title, setTitle] = useState('');
    /*  
        [{idQuestion: {
            idQuestion: #,
            question:'',            
            min: 0/1/n,
            max: 1/n/200,
            idAnswer:textA
            ...
            }, 
        {idQuestion: {
            idQuestion: #,
            question:'',            
            min: 0/1/n,
            max: 1/n/200,
            idAnswer:textA
            ...
            }, 
        ...]
    */

    /*  QUESTIONS RITORNATE A QAPrinter
        {
            {
                idQuestion: #,
                min: ,
                max ,
                question
            }
            ...
            {
                idQuestion: #,
                min: ,
                max ,
                question
            }
        }
    */

    /*  ANSWERS  RITORNATE A QAPrinter
        {
            {
                idQuestion: #,
                idAnswer: ,
                answer 
            }
            ...
            {
                idQuestion: #,
                idAnswer: ,
                answer 
            }
        }
    */

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);


    const handlePublication = (event) => {
        if (qstCount === 0) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            event.stopPropagation();
            const survey = { adminId: user.id, title: title, questions: [...questions], answers: [...answers] }
            API.createSurvey(survey);

            setSubmitted(true);
        }


    }



    return (<>{submitted ? <Redirect to={constants.URL_ADMIN_MAINPAGE} /> :
        <Container>
            <QuestionGrid>
                <input
                    as='text'
                    placeholder="Insert the survey's title"
                    style={titleInput}
                    onChange={(ev) => setTitle(ev.target.value)} />

                <QAPrinter questions={questions} setQuestions={setQuestions} answers={answers} setAnswers={setAnswers} mode={constants.EDIT_MODE} maxChar='200' setQstCount={setQstCount} qstCount={qstCount} />


            </QuestionGrid>
            <ButtonsGrid>
                <Button variant='outline-primary' onClick={() => setShow(true)} style={rounded} >{plusCircle} Add question</Button>
                {qstCount >= 1 ?
                    <Button variant='outline-success' onClick={(event) => handlePublication(event)} style={rounded} >{clipboardPlus} Publish survey</Button>
                    : ''}
            </ButtonsGrid>
            <CreationModal show={show} setShow={setShow} questions={questions} answers={answers} setQuestions={setQuestions} setAnswers={setAnswers} qstCount={qstCount} setQstCount={setQstCount} />
        </Container>

    }</>
    );

}

export default CreateSurveyPage;

