import styled from "styled-components";

export const cardSize = {
    width: '20rem',
    height: '12rem',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '30px',
    padding: '1rem',
    borderRadius: '25px',
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.3)'

};

export const rounded = {
    borderRadius: '25px'
};

export const CTitle =  styled.p`
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 6px;
`;

export const CHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

export const CBody = styled.div`
    width: auto;    
    height: 78px;
    flex-direction: column;
    align-items: fleex-start;
`;

export const CFooter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4%;
`;

export const badgeCounter = {
    fontSize: '1rem',
    borderRadius: '25px', 
    color: 'white',
    backgroundColor: 'transparent'
}