import axios from '../utils/request'
import path from './path'

const api = {
    postLogin(username, password){
        return axios.post(path.baseUrl + path.login, {
            username: username,
            password: password
        });
    }
}

export default api;