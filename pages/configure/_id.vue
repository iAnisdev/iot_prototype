<template>
  <section>
      <p>Configure Page</p>
      <p>{{currentDevice}}</p>
  </section>
</template>

<script>
import {mapGetters , mapActions} from 'vuex'
export default {
  data(){
    return
  },
  computed:{
    ...mapGetters({
      currentDevice:'getCurrentDevice'
    })
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    store.dispatch('fetchDevice' , route.params.id)
  },
}
</script>

<style>

</style>