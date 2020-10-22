export default {
    SET_SOCKET_STATUS: (state , status) => {
        return state.socketStatus = status
    },
    SET_AUTH: (state , data) => {
        return state.auth = data
    },
    SET_HARDWARE_SHADOW_LIST: (state , list) =>{
        return state.hardware_shadow_list = list
    }
}