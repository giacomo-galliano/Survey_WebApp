import { constants } from './utils/constants';

/*  CHECKED */
async function loadSurveys() {
    const response = await fetch(constants.URL_API + '/surveys');
    const surveys = await response.json();

    if (response.ok) {
        return surveys.map((sur) => ({ ...sur }));
    } else {
        throw surveys;
    }
}

/*  CHECKED */
async function loadSurveysByAdmin() {
    const response = await fetch(constants.URL_API + '/admin/surveys');
    const surveys = await response.json();

    if (response.ok) {
        return surveys.map((sur) => ({ ...sur }));
    } else {
        throw surveys;
    }
}

/*  CHECKED */
async function loadQABySurvey(surveyId){
  const response = await fetch(constants.URL_API + '/survey/' + surveyId);
  const results = await response.json();

  if(response.ok){
      return results.map((res) => ({...res}));
  }else{
      throw results;
  }
}

/*  CHECKED */
async function loadQRBySurvey(surveyId){
    const response = await fetch(constants.URL_API + '/admin/survey/' + surveyId +'/results' );
    const results = await response.json();

    if(response.ok){
        return results.map((res) => ({...res}));
    }else{
        throw results;
    }
}

/*  CHECKED */
async function setResults(result){
  const response = await fetch(constants.URL_API + '/admin/survey/results/set', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(result)
  });

  if(response.ok){
    return null;
  }else return{'err': 'POST error'};

}

/*  CHECKED */
async function createSurvey(survey){
  const response = await fetch(constants.URL_API + '/admin/survey/create', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(survey)
  });

  if(response.ok){
    return null;
  }else return{'err': 'POST error'};

}

/*  CHECKED */
async function login(credentials) {
    let response = await fetch(constants.URL_API + '/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  /*  CHECKED */
  async function logout() {
    const response = await fetch(constants.URL_API + '/sessions/current', {
      method: 'DELETE'
    });
    if (response.ok) {
      return null;
    } else return { 'err': 'DELETE error' };
  }
  
  /*  CHECKED */
  async function getUserInfo() {
    const response = await fetch(constants.URL_API + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

  const API = { loadSurveys, loadSurveysByAdmin, loadQABySurvey, loadQRBySurvey, setResults, createSurvey, login, logout, getUserInfo};

  export {API};