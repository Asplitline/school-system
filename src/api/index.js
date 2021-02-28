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
// --advice
const getAdviceList = _get('/')
// --post
const getPostList = _get('/post/api/pagePosts')
const deletePost = _delete('/post/api/deletePost')
// --comment
const getCommentList = _get('/comment/api/pageComment')
const deleteComment = _delete('/comment/api/deleteComment')
// home
// --
export {
    // login
    checkLogin,
    // user
    getUser,
    getUserList,
    addUser,
    editUser,
    deleteUser,
    resetPassword,
    // post
    getPostList,
    deletePost,
    // comment
    getCommentList,
    deleteComment
}
