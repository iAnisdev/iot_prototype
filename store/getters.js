export default {
    getSocketStatus:(state) =>{
        return state.socketStatus
    },
    getAuth: (state) =>{
        return state.auth
    },
    getHardwareShadowList: (state) =>{
        return state.hardware_shadow_list
    },
    getLoginStatus: (state) =>{
        return state.loggedIn
    }
}