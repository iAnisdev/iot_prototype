export default {
    SET_LOGIN_STATUS: (state , status) =>{
        return state.loggedIn = status
    },
    SET_SOCKET_STATUS: (state , status) => {
        return state.socketStatus = status
    },
    SET_AUTH: (state , data) => {
        return state.auth = data
    },
    SET_ACESS_TOKEN: (state , token) => {
        return state.accessToken = token
    },
    SET_HARDWARE_SHADOW_LIST: (state , list) =>{
        return state.hardware_shadow_list = list
    }
}