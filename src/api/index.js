import { _get, _post, _put, _delete } from './helpers'


// login
const checkLogin = _post('/account/api/login')
// admin
// --user
const getUserList = _get('/account/list')
const getUser = _post('/account/pageAccount')
const addUser = _post('/account/insert')
const editUser = _put('/account/updateIgnoreNull')
const resetPassword = _get('/account/changePassword')
const deleteUser = _delete('/account/delete')
// home
// --

export {
    checkLogin,
    getUser,
    getUserList,
    addUser,
    editUser,
    deleteUser,
    resetPassword
}
