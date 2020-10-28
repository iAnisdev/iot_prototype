// ~/plugins/persistedState.client.js
 
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";

var ls = new SecureLS({ isCompression: false , encryptionSecret: 'livecom_flight_2020'});
 
export default ({store}) => {
  createPersistedState({
    key: 'iot_presence_storage',
    storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
  })(store)
}