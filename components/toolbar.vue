<template>
  <section>
    <v-toolbar>
      <v-toolbar-title> <span>
        <v-icon :color="getSocketStatus == true ? 'green' : 'red'"
          name="mdi-access-point"
          x-large>mdi-access-point</v-icon>
          </span> hardwareshadow list</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="logout">
            <v-icon>mdi-export</v-icon>
          </v-btn>
      </v-toolbar>
  </section>
</template>

<script>
import {mapGetters , mapActions} from 'vuex'
export default {
  data(){
    return {
      
    }
  },
  computed:{
    ...mapGetters({
      getSocketStatus: 'getSocketStatus',
      auth: 'getAuth'
    }),
  },
  methods: {
    ...mapActions({
      logoutUser: 'logoutUser',
    }),
    async logout(){
      let _self = this
      await this.$auth.logout().then((resp) =>{
          console.log("resp " , resp)
           return _self.logoutUser()
      }).then(() =>{
            location.reload();
           _self.$nuxt.refresh()
        }).catch((err) => {
          console.log("err " , err)
      })
    }
  },
};
</script>
