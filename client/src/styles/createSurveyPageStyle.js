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

export const ButtonsGrid = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2rem;
    width: 100%;
`;

export const titleInput = {
    padding: '0.5rem',
    fontSize: '1.2rem',
    borderRadius: '15px', 
    marginBottom: '0.5rem'
}

export const rounded = {
  borderRadius: '25px'
}