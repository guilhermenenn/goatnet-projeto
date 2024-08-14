import Cookies from 'js-cookie';
import OlxApi from './OlxApi';

export const isLogged = () => {
    let token = Cookies.get('token');
    return token ? true : false;
}

export const returnToken = () => {
    let token = Cookies.get('token');
    return token;
}

export const returnEmail = () => {
    let email = Cookies.get('email');
    return email;
}

export const checkAdm = async () => {
    const api = OlxApi();
    const userData = await api.getUserByEmail(returnEmail());
    return userData.admUser;
}

export const doLogin = (token, email) => {
    Cookies.set('token', token);
    Cookies.set('email', email)
}

export const doLogout = () => {
    Cookies.remove('token');
    Cookies.remove('email')
}