import * as _ from 'underscore'

export default {
    authenticateUser({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$axios.$post('/authentication' , data).then((resp) =>{
                commit('SET_LOGIN_STATUS' , true)
                commit('SET_AUTH' , resp)
                resolve(resp)
            }).catch((err) =>{
                reject(err)
            })
        })
    },
    authenticateSocket({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$app.io.emit('create', 'authentication', data, function(error, authResult) {
                   commit('SET_AUTH' , authResult)
                   resolve(authResult)
                });
        })
    },
    createNewUser({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$axios.$post('/usertoken' , data).then((resp) =>{
                commit('SET_LOGIN_STATUS' , true)
                commit('SET_AUTH' , resp)
                resolve(resp)
            }).catch((err) =>{
                reject(err)
            })
        })
    },
    verifiyEmail({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$axios.$patch(`/usertoken?email=${data.email}&token=${data.token}`).then((resp) =>{
                resolve(resp)
            }).catch((err) =>{
                reject(err)
            })
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
    logoutUser({state , commit , dispatch} , data){
       return new Promise((resolve , reject) =>{
        try{
            commit('SET_HARDWARE_SHADOW_LIST' , [])
            commit('SET_LOGIN_STATUS' , false)
            commit('SET_AUTH' , {})
            resolve(true)
           }catch(err){
            reject(err)
           }
       })
    },
}