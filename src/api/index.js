import axios from '../utils/request'
import path from './path'

const api = {
    postLogin(username, password) {
        return axios.post(path.baseUrl + path.user + path.login, {
            username: username,
            password: password
        });
    },
    postBookInfo() {
        return axios.post(path.baseUrl + path.book + path.select)
    },
    postInsertBook(book) {
        return axios.post(path.baseUrl + path.book + path.insert, {...book});
    },
    postDeleteBook(bookName) {
        return axios.post(path.baseUrl + path.book + path.delete, {bookName: bookName});
    },
    postUpdatetBook(oldBookName, book) {
        return axios.post(path.baseUrl + path.book + path.update, {
            oldBookName: oldBookName,
            ...book
        });
    },
    postSelectBook(bookName) {
        return axios.post(path.baseUrl + path.book + path.select, {bookName: bookName});
    }
}

export default api;