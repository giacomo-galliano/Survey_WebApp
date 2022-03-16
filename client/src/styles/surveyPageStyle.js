import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  flex-direction: column;
  flex: 1;  
  width: 100%;
  margin-top: 20px;
  margin-bottom: 100px;
`;

export const QuestionGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
`;

export const TitleBox = styled.h1`
  padding: 2rem;
  font-size: 2rem;
`;

export const btnStyle = {
  borderRadius: '25px',
  marginTop: '1.5rem',  
  display: 'flex',
  width: '20%',
  justifyContent: 'center',
  alignItems: 'center' 
};

export const pageToggle = {
  margin: '0.4rem',
  cursor:'pointer'
}