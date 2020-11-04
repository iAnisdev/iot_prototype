<template>
  <section>
    <toolbar />
    <v-container v-if="isLoading" style="height: 80vh">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col class="subtitle-1 text-center" cols="12">
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
    <v-container v-if="!isLoading">
      <v-row dense v-for="(hardware, index) in HardwareShadowList" :key="index">
        <v-col cols="12">
          <v-card
            class="hardware__card"
            :style="{
              'border-left-color':
                hardware.message.status == 'online' ? 'green' : 'red'
            }"
          >
            <v-container fluid>
              <v-row dense>
                <v-col cols="3">
                  <v-card-subtitle>
                    Device
                  </v-card-subtitle>

                  <v-card-title>
                    {{ hardware.message.device }}
                  </v-card-title>
                </v-col>
                <v-col cols="3">
                  <v-card-subtitle>
                    MAC(id)
                  </v-card-subtitle>

                  <v-card-title>
                    {{ hardware.message.MAC }}
                  </v-card-title>
                </v-col>
                <v-col cols="2">
                  <v-card-subtitle>
                    Communication
                  </v-card-subtitle>

                  <v-card-title>
                    {{ hardware.receive.device }}
                    <br />
                    <span
                      v-if="hardware.message.MAC !== hardware.receive.MAC"
                      class="moduleId"
                    >
                      moduleId : {{ hardware.receive.MAC }}
                    </span>
                  </v-card-title>
                </v-col>
                <v-col cols="2">
                  <v-card-subtitle>
                    Protocol
                  </v-card-subtitle>

                  <v-card-title>
                    {{ hardware.server.COM }}
                  </v-card-title>
                </v-col>
                <v-col cols="2" style="text-align: left">
                  <v-row style="margin-left: 0vw">
                    <v-card-subtitle>Status</v-card-subtitle>
                    <nuxt-link :to="`/configure/${hardware._id}`">
                    <v-icon
                      large
                      small
                      color="blue darken-2"
                      style="margin-left: 4vw"
                    >
                      mdi-wrench
                    </v-icon>
                    </nuxt-link>
                  </v-row>
                  <v-card-subtitle>
                    <v-chip
                      :color="
                        hardware.message.status == 'online' ? 'green' : 'red'
                      "
                      text-color="white"
                    >
                      {{ hardware.message.status }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text>
                    {{ hardware.receive.dateStamp }}
                    {{ hardware.receive.timeStamp }}
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
import * as _ from "underscore";
import { mapGetters, mapActions } from "vuex";
import toolbar from "@/components/toolbar";
export default {
  components: {
    toolbar
  },
  data() {
    return {
      isLoading: false,
      hardwareshadow_list: [],
      pagination: {
        limit: 10,
        total: 10,
        skip: 0
      },
      currentPage: 1,
      pageOptions: [5, 10, 20, 25, 50]
    };
  },
  computed: {
    ...mapGetters({
      HardwareShadowList: "getHardwareShadowList",
      getSocketStatus: "getSocketStatus",
      getAuth: "getAuth",
      accessToken: "getAccessToken"
    }),
    noOfPages() {
      return Math.ceil(this.pagination.total / this.pagination.limit);
    }
  },
  methods: {
    ...mapActions({
      authenticateSocket: "authenticateSocket",
      loadHardwareShadows: "loadHardwareShadows",
      hardwareshadowCreate: "hardwareshadowCreate",
      hardwareshadowUpdate: "hardwareshadowUpdate",
      hardwareshadowDelete: "hardwareshadowDelete"
    }),

    init() {
      let _self = this;
      _self.isLoading = true;
      let data = {
        $skip: (_self.currentPage - 1) * _self.pagination.limit,
        $limit: _self.pagination.limit
      };
      _self
        .loadHardwareShadows(data)
        .then(res => {
          _self.pagination.limit = res.limit;
          _self.pagination.total = res.total;
          _self.pagination.skip = res.skip;
          _self.isLoading = false;
        })
        .catch(err => {
          console.log("error ", err);
        });
    },
    connectSocket() {
      this.authenticateSocket({
        strategy: "jwt",
        accessToken: this.accessToken
      }).then(() => {
        this.init();
        this.$app.io.on("hardwareshadow created", this.hardwareshadowCreate);
        this.$app.io.on("hardwareshadow updated", this.hardwareshadowUpdate);
        this.$app.io.on("hardwareshadow patched", this.hardwareshadowUpdate);
        this.$app.io.on("hardwareshadow removed", this.hardwareshadowDelete);
      });
    },
  },
  watch: {
    currentPage(newVal, oldVal) {
      let _self = this;
      _self.init();
    },
    pagination: {
      deep: true,
      handler: function(newVal, oldVal) {
        let _self = this;
        if (newVal.skip > newVal.total) {
          _self.currentPage = 1;
        }
        _self.init();
      }
    }
  },
  mounted() {
    this.connectSocket();
  }
};
</script>

<style scoped>
.hardware__card {
  border-left-width: 10px;
  border-left-style: solid;
}
.v-card__title {
  font-size: 1rem;
}
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0;
}
.moduleId {
  font-size: 0.75rem;
}
</style>
