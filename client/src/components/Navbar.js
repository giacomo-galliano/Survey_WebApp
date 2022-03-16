import { useContext } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { API } from '../API';
import { LoginContext, UserContext } from '../contexts/contexts';
import { constants } from '../utils/constants';
import { globe, personCircle, logout  } from '../assets/images';

function MyNavbar(props) {

    const { logged, setLogged } = useContext(LoginContext);
    const { user, setUser } = useContext(UserContext);

    const handleLogout = async () => {
        await API.logout();
        setLogged(false);
        setUser({ id: '', name: 'Guest User', email: '' });
    }

    return (
        <>
            <Navbar bg='dark' variant='dark' className="justify-content-between" style={{height: '50px'}}>
                <Navbar.Brand href={logged ? constants.URL_ADMIN_MAINPAGE : constants.URL_MAINPAGE}>{globe} AW1 - Survey App </Navbar.Brand>

                {logged ? <>
                    <span>
                        <span style={{color:'white'}}>{user.name}</span>
                        <span style={{color:'yellow', fontStyle:'italic', fontSize:'small', marginRight:'1rem'}}>  [ admin ]</span>
                    <Button variant="outline-danger" size='sm' className="justify-content" style={{
                            textAlign: 'center',
                            borderRadius: '25px'
                        }} onClick={handleLogout}>
                            {logout} Sign out</Button>
                    </span>
                </> : <>
                    <Link to={constants.URL_LOGIN}>
                        <Button variant="outline-light" size='sm' className="justify-content" style={{
                            textAlign: 'center',
                            borderRadius: '25px'
                        }} >
                            {personCircle} Login</Button>
                    </Link>
                </>}
            </Navbar>

        </>
    );
}

export default MyNavbar;