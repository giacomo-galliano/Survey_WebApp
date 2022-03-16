import { useState, useEffect } from 'react';
import { Form, Button, Modal, Col } from 'react-bootstrap';

import { plusCircle } from '../assets/images';
import { ButtonsGrid, rounded, selectOption } from '../styles/creationModalStyle';

function PrintAns(props) {

    const updateAns = (idAns, newA) => {
        props.setAnswers(props.answers.map(e => (
            e.idAnswer === idAns ? { ...e, answer: newA } : e
        )));
    }

    return (<>

        < Form.Group key={props.a.idAnswer} controlId={props.a.idAnswer}>
            <Form.Label>Answer {props.a.idAnswer}</Form.Label>
            <Form.Row >
                <Form.Control required type="text" placeholder="Answer text.." style={rounded} value={props.a.answer} onChange={(ev) => { updateAns(props.a.idAnswer, ev.target.value); }} />
                <Form.Control.Feedback type="invalid">
                    Please insert an answer.
            </Form.Control.Feedback>
            </Form.Row>
        </Form.Group>
    </>);
}

function CreationModal(props) {

    const qstId = props.qstCount + 1;

    const defaultValues = {
        question: '', min: 0, max: 1,
        answers: [{ idQuestion: qstId, idAnswer: 1, answer: '' }]
    }

    const [question, setQuestion] = useState(defaultValues.question);
    const [min, setMin] = useState(defaultValues.min);
    const [max, setMax] = useState(defaultValues.max);

    const [answers, setAnswers] = useState(defaultValues.answers);

    const [ansCounter, setAnsCounter] = useState(1);

    const [validated, setValidated] = useState(false);

    const addEmptyAns = () => {
        if (ansCounter < 10) {
            const tmp = { idQuestion: qstId, idAnswer: ansCounter + 1, answer: '' };

            setAnswers(answers.concat(tmp));
            setAnsCounter(ansCounter + 1);
        }
    }

    const handleClose = () => props.setShow(false);

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

            props.setQuestions(props.questions.concat({ idQuestion: qstId, question: question, min: min, max: max }));

            const tmp = props.answers;
            answers.map((ans) => tmp.push(ans))
            props.setAnswers(tmp);

            props.setQstCount(qstId);
            props.setShow(false);
        }
    }

    useEffect(() => {
        if (props.show) {
            setQuestion(defaultValues.question);
            setMin(defaultValues.min);
            setMax(defaultValues.max);
            setAnswers(defaultValues.answers);
            setAnsCounter(1);
        }
    }, [props.show])

    return (<>

        <Modal show={props.show} onHide={handleClose} backdrop='static' key={props.qstCount}>
            <Modal.Header closeButton>
                <Modal.Title>Create a new question</Modal.Title>
            </Modal.Header>
            <Modal.Body key={'Mod_Head'+qstId}>
                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                    <Form.Group controlId='question'>
                        <Form.Label>Question</Form.Label>
                        <Form.Control required type="text" placeholder="Question text.." style={rounded} value={question} onChange={ev => setQuestion(ev.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Please insert a question.
                            </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='mandatoryQuestion'>
                        <Form.Row>
                            <Col xs='6'>
                                <Form.Check type="switch" label="Mandatory question" checked={min} onChange={() => setMin(parseInt(min === 0 ? 1 : 0))}>
                                </Form.Check>
                            </Col>
                            {min !== 0 ?
                                <Col><label for='min_selector'> Min </label>
                                    <select id='min_selector' style={selectOption}>
                                        {min !== 0 ? <option value={0} onClick={(ev) => setMin(parseInt(ev.target.value))}>0</option> : null}
                                        {ansCounter >= 1 ? <option value={1} selected={min === 1 ? true : false} onClick={(ev) => setMin(parseInt(ev.target.value))}>1</option> : null}
                                        {ansCounter >= 2 ? <option value={2} onClick={(ev) => setMin(parseInt(ev.target.value))}>2</option> : null}
                                        {ansCounter >= 3 ? <option value={3} onClick={(ev) => setMin(parseInt(ev.target.value))}>3</option> : null}
                                        {ansCounter >= 4 ? <option value={4} onClick={(ev) => setMin(parseInt(ev.target.value))}>4</option> : null}
                                        {ansCounter >= 5 ? <option value={5} onClick={(ev) => setMin(parseInt(ev.target.value))}>5</option> : null}
                                        {ansCounter >= 6 ? <option value={6} onClick={(ev) => setMin(parseInt(ev.target.value))}>6</option> : null}
                                        {ansCounter >= 7 ? <option value={7} onClick={(ev) => setMin(parseInt(ev.target.value))}>7</option> : null}
                                        {ansCounter >= 8 ? <option value={8} onClick={(ev) => setMin(parseInt(ev.target.value))}>8</option> : null}
                                        {ansCounter >= 9 ? <option value={9} onClick={(ev) => setMin(parseInt(ev.target.value))}>9</option> : null}
                                        {ansCounter === 10 ? <option value={10} onClick={(ev) => setMin(parseInt(ev.target.value))}>10</option> : null}
                                    </select>
                                </Col> : ''}
                            {max > 1 && max <= 10 ?
                                <Col><label for='max_selector'> Max </label>
                                    <select id='max_selector' style={selectOption}>
                                        {min <= 1 && ansCounter >= 1 ? <option value={1} onClick={(ev) => setMax(parseInt(ev.target.value))}>1</option> : null}
                                        {min <= 2 && ansCounter >= 2 ? <option value={2} onClick={(ev) => setMax(parseInt(ev.target.value))}>2</option> : null}
                                        {min <= 3 && ansCounter >= 3 ? <option value={3} onClick={(ev) => setMax(parseInt(ev.target.value))}>3</option> : null}
                                        {min <= 4 && ansCounter >= 4 ? <option value={4} onClick={(ev) => setMax(parseInt(ev.target.value))}>4</option> : null}
                                        {min <= 5 && ansCounter >= 5 ? <option value={5} onClick={(ev) => setMax(parseInt(ev.target.value))}>5</option> : null}
                                        {min <= 6 && ansCounter >= 6 ? <option value={6} onClick={(ev) => setMax(parseInt(ev.target.value))}>6</option> : null}
                                        {min <= 7 && ansCounter >= 7 ? <option value={7} onClick={(ev) => setMax(parseInt(ev.target.value))}>7</option> : null}
                                        {min <= 8 && ansCounter >= 8 ? <option value={8} onClick={(ev) => setMax(parseInt(ev.target.value))}>8</option> : null}
                                        {min <= 9 && ansCounter >= 9 ? <option value={9} onClick={(ev) => setMax(parseInt(ev.target.value))}>9</option> : null}
                                        {ansCounter === 10 ? <option value={10} onClick={(ev) => setMax(parseInt(ev.target.value))}>10</option> : null}
                                    </select>
                                </Col> : ''}
                        </Form.Row>
                    </Form.Group>

                    <Form.Group controlId='multipleAnswer'>
                        <Form.Check type="radio" label="Single choice answer" id='SCanswer' checked={max === 1 ? 1 : 0} onChange={() => setMax(1)}></Form.Check>
                        <Form.Check type="radio" label="Multiple choice answer" id='MCanswer' checked={(max > 1 && max !== 200) || (max > 1 && max !== 200 && min > 1) ? 1 : 0} onChange={() => setMax(2)}></Form.Check>
                        <Form.Check type="radio" label="Open answer" id='Oanswer' checked={max === 200 ? 1 : 0} onChange={() => setMax(200)}></Form.Check>
                    </Form.Group>

                    {max !== 200 ? answers.map((a) => <>
                        <PrintAns key={a.idAnswer} max={max} a={a} answers={answers} setAnswers={setAnswers} />
                    </>
                    ) : ''
                    }

                    <Modal.Footer>
                        <ButtonsGrid>
                            {max !== 200 ?
                                <Button variant='outline-primary' onClick={addEmptyAns} style={rounded} >{plusCircle} Add answer</Button>
                                : ''}
                            <Button variant='outline-success' type='submit' style={rounded} >Add question</Button>
                        </ButtonsGrid>
                    </Modal.Footer>

                </Form>
            </Modal.Body>

        </Modal>

    </>);
}

export { CreationModal };
