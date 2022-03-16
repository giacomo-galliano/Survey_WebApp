import styled from "styled-components";

export const QBox = styled.div`
  display: flex;
  justify-content: flex-center;
  align-items: flex-start;
  flex-direction: column; 
  box-shadow: ${props => props.error ? '0 1px 6px rgb(255, 0, 0)' : '0 1px 8px rgba(0, 0, 0, 0.3)'};
  background-color: rgb(76, 145, 205);
  border-radius: 10px;
  width: 50%;
  color: white;
  margin: 0.5rem;
`;

export const QBoxHeader = styled.div`
display: flex;
justify-content: flex-start;
align-items: flex-start;
background-color: rgb(33, 101, 158);
padding: 0.5rem;
border-radius: 10px;
font-size: 1.2rem;
font-weight: bold;
width: 100%;
`;

export const QBoxBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  font-size: 1.2rem;
  width: 99%;
`;

export const QBoxFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  width: 98%;
`;

export const aligned = {
  display: 'flex',
  alignItems: 'center'
}

export const inputText = {
  padding: '0.7rem',
  fontSize: '1rem', 
  borderRadius: '10px'
}

export const editSpan = {
  margin: '0.4rem',
  cursor: 'pointer',
  color: 'white',
}

export const footerText = {
  marginLeft: '0.5rem', 
  fontSize: '0.8rem'
}

export const guestUserName = {
  fontSize:'1.3rem',
  color: 'rgb(76, 145, 205)'
}