export default {
    getSocketStatus:(state) =>{
        return state.socketStatus
    },
    getAuth: (state) =>{
        return state.auth
    },
    getAccessToken: (state) =>{
        return state.accessToken
    },
    getHardwareShadowList: (state) =>{
        return state.hardware_shadow_list
    },
    getLoginStatus: (state) =>{
        return state.loggedIn
    },
    getCurrentDevice: (state) =>{
        return state.currentDevice
    }
}