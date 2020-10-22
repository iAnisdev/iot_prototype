
import * as _ from 'underscore'

export default {
    authenticateSocket({commit , dispatch} , data) {
        return new Promise((resolve , reject) =>{
            this.$app.io.emit('create', 'authentication', {
                "strategy": "local",
                    "email" :"darma2@darma.com",
                    "password" : "darmia"
                }, function(error, authResult) {
                  // add auth result to store for future use
                   commit('SET_AUTH' , authResult)
                   resolve(authResult)
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
    }
}