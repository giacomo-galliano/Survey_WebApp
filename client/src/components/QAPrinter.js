import { useContext } from 'react';
import { Form } from 'react-bootstrap';

import { LoginContext } from '../contexts/contexts';

import { QBox, QBoxBody, QBoxHeader, QBoxFooter, aligned, inputText, editSpan, footerText, guestUserName } from '../styles/QAPrinterStyles';
import { trash, arrowDown, arrowUp } from '../assets/images';
import { constants } from '../utils/constants';


function QAPrinter(props) {

    const { logged } = useContext(LoginContext);

    const q0 = { idQuestion: 0, idAnswer: 0, min: 1, max: 200, question: 'Insert your name:' }

    const updateAns = (idQst, idAns, newA) => {
        props.setAnswers(props.answers.map((e) => (
            e.idQuestion === idQst && e.idAnswer === idAns ? { ...e, selected: newA } : e
        )));
    }

    const updateAnsCheck = (idQst, idAns, event) => {
        const ev = event;

        if (ev.type === 'radio') {
            props.setAnswers(props.answers.map((e) => (
                e.idQuestion === idQst ? (e.idAnswer === idAns ? { ...e, selected: ev.checked } : { ...e, selected: false }) : e
            )));
        } else {
            props.setAnswers(props.answers.map((e) => (
                e.idQuestion === idQst && e.idAnswer === idAns ? { ...e, selected: ev.checked } : e
            )));
        }
    }

    const handleDelete = (idQ) => {

        props.setQuestions(props.questions.filter((qst) => (qst.idQuestion !== idQ)).map((q) => (
            q.idQuestion > idQ ? { ...q, idQuestion: q.idQuestion - 1 } : q)));

        props.setAnswers(props.answers.filter((ans) => (ans.idQuestion !== idQ)).map((ans) => (
            ans.idQuestion > idQ ? { ...ans, idQuestion: ans.idQuestion - 1 } : ans)));
    }

    const handleMoveUp = (idQ) => {
        if (idQ !== 1) {

            props.setQuestions(props.questions.map((qst) => (
                qst.idQuestion === idQ - 1 ? { ...qst, idQuestion: idQ } : (
                    qst.idQuestion === idQ ? { ...qst, idQuestion: idQ - 1 } : qst
                )
            )))

            props.setAnswers(props.answers.map((ans) => (
                ans.idQuestion === idQ - 1 ? { ...ans, idQuestion: idQ } : (
                    ans.idQuestion === idQ ? { ...ans, idQuestion: idQ - 1 } : ans
                )
            )))
        }
    }

    const handleMoveDown = (idQ) => {
        if (idQ !== props.qstCount) {

            props.setQuestions(props.questions.map((qst) => (
                qst.idQuestion === idQ + 1 ? { ...qst, idQuestion: idQ } : (
                    qst.idQuestion === idQ ? { ...qst, idQuestion: idQ + 1 } : qst
                )
            )))

            props.setAnswers(props.answers.map((ans) => (
                ans.idQuestion === idQ + 1 ? { ...ans, idQuestion: idQ } : (
                    ans.idQuestion === idQ ? { ...ans, idQuestion: idQ + 1 } : ans
                )
            )))
        }
    }

    return (<>
        {logged ? <>{props.mode === constants.RESULTS_MODE ? <span style={guestUserName}>{props.guestName} </span> : ''} </> : <>
            <QBox key={q0.idQuestion} error={props.showErr && props.errors[q0.idQuestion] ? true : false} >
                <QBoxHeader>{q0.question}</QBoxHeader>
                <QBoxBody>
                    <Form.Control as='input' maxLength={props.maxChar} style={inputText}  onChange={ev => props.setGuestName(ev.target.value)} />
                    <Form.Control.Feedback type='invalid'>Please, insert your name</Form.Control.Feedback>
                </QBoxBody>
                <QBoxFooter >
                    {q0.min !== 0 ? <span> mandatory question |</span> : ''}
                    <span style={footerText}>min: {q0.min}</span>
                    <span style={footerText}>max: {q0.max}{q0.max === 200 ? ' char' : ''}</span>
                </QBoxFooter>
            </QBox>
        </>}

        {props.questions.sort((a, b) => {
            return a.idQuestion - b.idQuestion
        }).map(qst => <>
            <QBox key={'QBox_'+qst.idQuestion} error={props.showErr && props.errors[qst.idQuestion] ? true : false}>
                <QBoxHeader key={'QBoxHead_'+qst.idQuestion} >{qst.question}</QBoxHeader>
                <QBoxBody key={'QBoxBody_'+qst.idQuestion} >
                    {props.answers.filter((ans) => (ans.idQuestion === qst.idQuestion))
                        .map((a) => <>
                            {qst.max === 200 ?
                                <>
                                    <Form.Control id={`${qst.idQuestion}_${a.idAnswer}`} as={'input'} disabled={props.mode === constants.COMPILE_MODE ? false : true}
                                        maxLength={props.maxChar} style={inputText} value={a.selected === false ? '' : a.selected}
                                        onChange={(ev) => { updateAns(qst.idQuestion, a.idAnswer, ev.target.value); }} />
                                    <Form.Control.Feedback type='invalid'>Please, insert an answer</Form.Control.Feedback>
                                </> : <>
                                    <Form.Check
                                        id={`${qst.idQuestion}_${a.idAnswer}`}
                                        type={qst.max === 1 ? 'radio' : 'checkbox'}
                                        label={a.answer}
                                        name={qst.idQuestion}
                                        checked={a.selected }
                                        disabled={props.mode === constants.COMPILE_MODE ? false : true}
                                        onChange={(ev) => { updateAnsCheck(qst.idQuestion, a.idAnswer, ev.target) }}
                                        style={aligned}
                                    />
                                </>}
                        </>)}
                </QBoxBody>
                {props.mode === constants.EDIT_MODE ? <>
                    <QBoxFooter>
                        <span onClick={() => handleDelete(qst.idQuestion)} style={editSpan}>{trash}</span>
                        <span onClick={() => handleMoveUp(qst.idQuestion)} style={editSpan} >{arrowUp}</span>
                        <span onClick={() => handleMoveDown(qst.idQuestion)} style={editSpan} >{arrowDown}</span>
                    </QBoxFooter>
                </> : <>
                    <QBoxFooter >
                        {qst.min !== 0 ? <span> mandatory question |</span> : ''}
                        <span style={footerText}>min: {qst.min}</span>
                        <span style={footerText}>max: {qst.max}{qst.max === 200 ? ' char' : ''}</span>
                    </QBoxFooter></>}
            </QBox>
        </>
        )}
    </>
    );
}

export { QAPrinter };