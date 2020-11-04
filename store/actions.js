import * as _ from 'underscore'

export default {
    authenticateSocket({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$app.io.emit('create', 'authentication', data, function(error, authResult) {
                if(error){
                    return reject(error)
                }
                commit('SET_AUTH' , authResult)
                commit('SET_ACESS_TOKEN' , authResult.accessToken)
                   resolve(authResult)
                });
        })
    },
    createNewUser({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$app.io.emit('create', 'usertoken', data, function(error, resp) {
                if(error){
                    return reject(error)
                }
                resolve(resp)
            });
        })
    },
    verifiyEmail({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$app.io.emit('patch', 'usertoken', null, {
                email: data.email,
                token: data.token
            },
             function( error , resp) {
                if(error){
                    return reject(error)
                }
                resolve(resp)
            });
        })
    },
    loadHardwareShadows({commit , dispatch} , data){
        return new Promise((resolve , reject) => {
            this.$app.io.emit('find' ,'hardwareshadow', {
                $skip: data.$skip,
                $limit: data.$limit
            }, (error, resp) => {
            if(error) reject(error);
            commit('SET_HARDWARE_SHADOW_LIST' , resp.data)
            resolve(resp)
            });
        })
    },
    hardwareshadowCreate({ state , commit , dispatch} , data){
        if(data){
            let updated_list =  state.hardware_shadow_list
            updated_list.unshift(data)
            commit('SET_HARDWARE_SHADOW_LIST' , updated_list)
        }
    },
    hardwareshadowUpdate({state , commit , dispatch} , data){
        if(data){
            let updated_list  = _.map(state.hardware_shadow_list , (hardwareshadow) =>{
                if(hardwareshadow._id == data._id){
                    return data
                }else{
                    return hardwareshadow
                }
            })
            commit('SET_HARDWARE_SHADOW_LIST' , updated_list)
        }

    },
    hardwareshadowDelete({state , commit , dispatch} , data){
        if(data){
            let updated_list =  _.reject( state.hardware_shadow_list, function(obj){ return obj._id == data._id });
            commit('SET_HARDWARE_SHADOW_LIST' , updated_list)
        }
    },
    fetchDevice({state , commit , dispatch} , id){
        console.log("fetchDevice " , id)
        return new Promise((resolve , reject) =>{
            this.$axios.get(`http://darmaserver.ddns.net:3131/hardwareshadow/${id}`).then((resp) => {
                commit('SET_CURRENT_DEVICE' , resp.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    logoutUser({state , commit , dispatch} , data){
       return new Promise((resolve , reject) =>{
        try{
            commit('SET_HARDWARE_SHADOW_LIST' , [])
            commit('SET_LOGIN_STATUS' , false)
            commit('SET_AUTH' , {})
            commit('SET_ACESS_TOKEN' , '')
            resolve(true)
           }catch(err){
            reject(err)
           }
       })
    }
}