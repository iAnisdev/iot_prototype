<template>
  <section>
    <v-toolbar>
      <v-toolbar-title >hardwareshadow list</v-toolbar-title>
    </v-toolbar>
    <v-container v-if="isLoading" style="height: 80vh">
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="12"
        >
          Loading Data....
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid v-if="!isLoading">
      <v-row dense v-for="(hardware , index) in hardwareshadow_list" :key="index">
        <v-col cols="12">
          <v-card class="hardware__card"  :style="{
            'border-left-color': hardware.message.status == 'online' ? 'green' : 'red'
          }">
            <v-container fluid>
              {{hardware._id}}
              <v-row dense>
                <v-col cols="3">
                  <v-card-title>
                    Device
                  </v-card-title>

                  <v-card-subtitle>
                    {{hardware.message.device}}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="3">
                  <v-card-title>
                    MAC(id)
                  </v-card-title>

                  <v-card-subtitle>
                    {{hardware.message.MAC}}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="2">
                  <v-card-title>
                    Communication
                  </v-card-title>

                  <v-card-subtitle>
                    {{hardware.receive.device}}
                    <br />
                    <span v-if="hardware.message.MAC !== hardware.receive.MAC">
                      moduleId : {{hardware.receive.MAC}}
                    </span>
                  </v-card-subtitle>
                </v-col>
                <v-col cols="2">
                  <v-card-title>
                    Protocol
                  </v-card-title>

                  <v-card-subtitle>
                    {{hardware.server.COM}}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="2">
                  <v-card-subtitle >
                    <v-chip
                      :color="hardware.message.status == 'online' ? 'green' : 'red'"
                      text-color="white"
                    >
                      
                    {{hardware.message.status}}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text >
                    {{hardware.receive.dateStamp}} {{ hardware.receive.timeStamp}}
                  </v-card-text>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="noOfPages > 1">
        <v-col cols="3">
        <v-select
          :items="pageOptions"
          label="Per Page style"
          v-model="pagination.limit"
          outlined
        ></v-select>
      </v-col>
        <v-col cols="6">
        <v-pagination
          v-model="currentPage"
          class="my-4"
          :length="noOfPages"
        ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import * as _ from 'underscore'
const feathers = require("@feathersjs/feathers");
const socketio = require("@feathersjs/socketio-client");
const io = require("socket.io-client");

const socket = io("http://myowniot.ddns.net:3131");
const app = feathers();
// Set up Socket.io client with the socket
app.configure(socketio(socket));

socket.on("connect", () => {
  console.log( `%cConnected to WS server ${socket.id} `,  "background-color: green; color: white; padding: 1px 2px");

})

export default {
  components: {},
  data(){
    return {
      isLoading: false,
      hardwareshadow_list:[],
      pagination:{
        limit: 10,
        total: 10,
        skip: 0
      },
      currentPage: 1,
      pageOptions: [ 5 , 10 , 20 , 25 , 50]
    }
  },
  computed:{
    noOfPages(){
      return Math.ceil(this.pagination.total / this.pagination.limit)
    }
  },
  methods: {
    authenticateSocket(){
      let that = this
      app.io.emit('create', 'authentication', {
      "strategy": "local",
          "email" :"darma2@darma.com",
          "password" : "darmia"
      }, function(error, authResult) {
        // console.log("authResult " , authResult); 
      });
    },

    init() {
      let that = this
      that.isLoading = true
       app.io.emit('find' ,'hardwareshadow', {
        $skip: (that.currentPage - 1) *  that.pagination.limit,
        $limit: that.pagination.limit
      }, (error, resp) => {
        that.hardwareshadow_list = resp.data
        that.pagination.limit = resp.limit
        that.pagination.total = resp.total
        that.pagination.skip = resp.skip
        that.isLoading = false
      });
      
    },
    hardwareshadowCreate(data){
      let that = this
      that.hardwareshadow_list.unshift(data)
    },
    hardwareshadowUpdate(data){
      let that = this
      that.hardwareshadow_list = _.map(that.hardwareshadow_list , (hardwareshadow) =>{
        if(hardwareshadow._id == data._id){
          return data
        }else{
          return hardwareshadow
        }
      })
    },
    hardwareshadowDelete(data){
        let that = this
        that.hardwareshadow_list =  _.reject(that.hardwareshadow_list, function(obj){ return obj._id == data._id });
    }
  },
  watch:{
    currentPage(newVal , oldVal){
      let that = this
      that.init();
    },
    pagination: {
      deep: true,
      handler: function(newVal , oldVal) {
        let that = this
        if(newVal.skip >  newVal.total){
          that.currentPage = 1
        }
        that.init();
      }
    }
  },
  mounted() {
    let that = this;
    that.authenticateSocket()
    app.io.on('hardwareshadow created' , that.hardwareshadowCreate)
    app.io.on('hardwareshadow updated' , that.hardwareshadowUpdate)
    app.io.on('hardwareshadow patched' , that.hardwareshadowUpdate)
    app.io.on('hardwareshadow removed' , that.hardwareshadowDelete)
    that.init();
  },

};
</script>

<style scoped>
.hardware__card{
  border-left-width: 10px;
  border-left-style: solid;
}
</style>
