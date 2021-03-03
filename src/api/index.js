import { _get, _post, _put, _delete, _deleteOld } from './helpers'

// login
const checkLogin = _post('/account/api/login')
// admin
// --user
const getUser = _get('/account/list')
const getUserList = _post('/account/pageAccount')
const addUser = _post('/account/insert')
const editUser = _put('/account/updateIgnoreNull')
const resetPassword = _get('/account/changePassword')
const deleteUser = _delete('/account/delete')
// --advice
const getAdviceList = _get('/addvice/pageAddvice')
const deleteAdvice = _deleteOld('/addvice/delete')
// --donate
const getDonateList = _get('/donate/pageDonate')
const deleteDonate = _deleteOld('/donate/delete')
// --news
const getNewsList = _get('/news/pageNews')
const deleteNews = _deleteOld('/news/delete')
const addNews = _post('/news/insert')
const editNews = _put('/news/updateIgnoreNull')
// --post
const getPost = _get('/post/getAllPosts')
const getPostList = _get('/post/api/pagePosts')
const deletePost = _delete('/post/api/deletePost')
// --comment
const getCommentList = _get('/comment/api/pageComment')
const deleteComment = _delete('/comment/api/deleteComment')
// --log
const getLogList = _get('/logs/pageLogs')
const deleteLog = _deleteOld('/logs/delete')
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
    // advice
    getAdviceList,
    deleteAdvice,
    //  donate
    getDonateList,
    deleteDonate,
    // news
    getNewsList,
    deleteNews,
    addNews,
    editNews,
    // post
    getPost,
    getPostList,
    deletePost,
    // comment
    getCommentList,
    deleteComment,
    // log
    getLogList,
    deleteLog
}
