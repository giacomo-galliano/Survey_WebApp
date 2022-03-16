'use strict';

const sqlite = require('sqlite3');

/* open the database */
const db = new sqlite.Database('./surveys.db', (err) => {
    if (err) throw err;
});

/* get all the surveys */
/*  CHECKED */
exports.getSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const surveys = rows.map((s) => ({ id: s.id_survey, adminId: s.id_admin, title: s.title, NoA: s.NoA }));
            resolve(surveys);
        });
    });
};

/* get all the surveys given an admin id */
/*  CHECKED */
exports.getAdminSurveys = (adminId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE id_admin=?';
        db.all(sql, [adminId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const surveys = rows.map((s) => ({ id: s.id_survey, adminId: s.id_admin, title: s.title, NoA: s.NoA }));
            resolve(surveys);
        });
    });
};

/* get all the questions and the relative answers for a given survey */
/*  CHECKED */
exports.getQABySurveyId = (idSurvey) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT questions.id_question, id_answer, min, max, question, answer FROM questions LEFT OUTER JOIN possibleAnswers ON questions.id_question=possibleAnswers.id_question AND questions.id_survey=possibleAnswers.id_survey WHERE questions.id_survey=?';

        db.all(sql, [idSurvey], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows == undefined) {
                resolve({ error: ' SURVEY ID not found.' });
            } else {
                const questions = rows.map((s) => ({ idQuestion: s.id_question, idAnswer: s.id_answer, min: s.min, max: s.max, question: s.question, answer: s.answer }));
                resolve(questions);
            }
        });
    });
};


/* create a new survey */
/*  CHECKED    */
exports.createSurvey = (title, adminId, answers, questions) => {
    return new Promise((resolve, reject) => {
        let idn = '';

        db.get('SELECT max(id_survey) as newid FROM surveys', [], (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (res == undefined) {
                reject('max ID not found.');
                return;
            } else {
                idn = res.newid;
                idn++;

                db.serialize(() => {
                    const sql = 'INSERT INTO surveys(id_survey, id_admin, title, NoA) VALUES(?, ?, ?, ?)';
                    db.run(sql, [idn, adminId, title, 0], function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(this.id);
                    });

                    const sqlQ = 'INSERT INTO questions(id_question, id_survey, question, min, max) VALUES(?, ?, ?, ?, ?)';
                    questions.map((qst) => {
                        db.run(sqlQ, [qst.idQuestion, idn, qst.question, qst.min, qst.max], function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(this.id);
                        });
                    })


                    const sqlA = 'INSERT INTO possibleAnswers(id_answer, id_survey, id_question, answer) VALUES(?, ?, ?, ?)';
                    answers.map((ans) => {
                        db.run(sqlA, [ans.idAnswer, idn, ans.idQuestion, ans.answer], function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(this.id);
                        });
                    })

                })
            }
        });

    });
};

exports.setSurveyResults = (surveyId, guestName, results) => {
    return new Promise((resolve, reject) => {
        let idn = '';
        let noa = '';

        db.get('SELECT max(id_guest) as newid FROM results', [], (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (res == undefined) {
                reject('max ID not found.');
                return;
            } else if (res === null) {
                idn = 1;
            } else {
                idn = res.newid;
                idn++;

                db.serialize(() => {
                    const sql = 'INSERT INTO results(id_guest, id_survey, results, guest_name) VALUES(?, ?, ?, ?)';
                    db.run(sql, [idn, surveyId, results, guestName], function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(this.id);
                    });

                    db.get('SELECT NoA as newnoa FROM surveys WHERE id_survey=?', [surveyId], (err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (res == undefined) {
                            reject('max NoA not found.');
                            return;
                        } else {
                            noa = res.newnoa;
                            noa++;

                            const sqlQ = 'UPDATE surveys SET NoA=? WHERE id_survey=?';
                            db.run(sqlQ, [noa, surveyId], function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(this.id);
                            });

                        }
                    })
                });
            }
        });
    })
};


/* get all the results for a given survey */
exports.getQRBySurvey = (idSurvey) => {
    /*const sql = 'SELECT questions.id_question, id_answer, min, max, question, answer FROM questions 
    LEFT OUTER JOIN possibleAnswers ON questions.id_question=possibleAnswers.id_question 
    AND questions.id_survey=possibleAnswers.id_survey WHERE questions.id_survey=?';
*/
    return new Promise((resolve, reject) => {
        const sqlR = 'SELECT * FROM results WHERE id_survey=?';
        db.all(sqlR, [idSurvey], (err, rows) => {
            if (err) {
                reject(err);
                return;
            } if (rows == undefined) {
                resolve({ error: ' SURVEY ID not found.' });
            } else {
                const results = rows.map((s) => ({ idGuest: s.id_guest, results: JSON.parse(s.results), guestName: s.guest_name }));
                resolve(results);
            }
        })
    });
}
