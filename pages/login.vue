<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row class="fill-height">
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 blue--text text--accent-3">Sign in to Micro-ID </h1>
                        <div class="text-center" mt-4>
                        </div>
                        <h4 class="text-center mt-4">Ensure your email for registration</h4>
                        <v-form>
                          <v-text-field v-model="emailLogin"
                          name="Email"
                          prepend-icon="mdi-email"
                          placeholder="Enter your email Adress"
                          type="text"
                          color="blue accent-3" />
                          <v-text-field v-model="passwordLogin"
                          id="password"
                          name="Password"
                          placeholder="Enter your password"
                          prepend-icon="mdi-lock"
                          type="password"
                          color="blue accent-3" />
                        </v-form>
                        <h3 class="text-center mt-3">Forget your password ?</h3>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn rounded color="blue accent-3" dark  @click="postLogin()" >SIGN IN</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="blue accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Hello Friend!</h1>
                        <h5 class="text-center">Enter in your personal details and start your journey with us</h5>
                      </v-card-text>
                      <div class="text-center">
                      <v-btn rounded outlined="" dark @click="step++">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" :class="`${boxSignUp.leftBarColor} accent-3`">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">{{boxSignUp.leftHeader1}}</h1>
                        <h5 class="text-center">{{boxSignUp.leftHeader5}}</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">SIGN IN</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 blue--text text--accent-3">{{boxSignUp.rightHeader1}}</h1>
                        <div class="text-center mt-4">
                        </div>
                        <h4 class="text-center mt-4">{{boxSignUp.rightHeader5}}</h4>
                        <v-form>
                          <v-text-field v-model="nameSignIn"
                          placeholder="Enter your name"
                          name="Name"
                          prepend-icon="mdi-account"
                          type="text"
                          color="blue accent-3" />

                          <v-text-field v-model="emailSignIn"
                          placeholder="Enter your email Adress"
                          name="Email"
                          prepend-icon="mdi-email"
                          type="text"
                          color="blue accent-3" />

                          <v-text-field v-model="passwordSignIn"
                          placeholder="Enter your Password"
                          name="Password"
                          prepend-icon="mdi-lock"
                          type="password"
                          color="blue accent-3" />
                        </v-form>
                        
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="blue accent-3" dark @click="postSignUp()" >SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <div>    
      <v-snackbar text
        v-model="alert.alertMsg"
        timeout=3500
        :color="alert.alertMsgType"
        centered
      >
        <v-alert :type="alert.alertMsgType">
          {{alert.alertMsgText}}
        </v-alert>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import {mapGetters , mapActions} from 'vuex'
export default {
  data: () => ({
    //login fields
    emailLogin: '',
    passwordLogin: '',
    //signup fields
    nameSignIn: '',
    emailSignIn: '',
    passwordSignIn: '',
    step: 1,
    alert:{
      alertMsgText:"",
      alertMsg :false,
      alertMsgType: "success"
    },
    boxSignUp:{
      leftHeader1:"Welcome Back!",
      leftHeader5:"To keep connected with us, Please login with your personal info",
      leftBarColor: "blue",
      rightHeader1:"Create Account",
      rightHeader5:"Ensure your email for registration",
      rightButton: true
    }
    
  }),
  methods: {
    ...mapActions({
      authenticateUser: 'authenticateUser',
      createNewUser: 'createNewUser',
      authenticateSocket: 'authenticateSocket',
    }),
    postSignUp() {
      let _self = this
      let data = {name: this.nameSignIn, email: this.emailSignIn, password: this.passwordSignIn }
      this.createNewUser(data).then(res => {
        this.alert.alertMsgText = res.success + ", Please check your email for verification"
        this.alert.alertMsg = true;
        this.alert.alertMsgType = "success";
        // this.step = 1;
        this.boxSignUp.leftHeader1="Welcome " + this.data.name,
        this.boxSignUp.leftHeader5="After email verification, you can proceed to Sign In",
        this.boxSignUp.leftBarColor= "success",
        this.boxSignUp.rightHeader1="Account Created",
        this.boxSignUp.rightHeader5="Please check your email for verification",
        this.boxSignUp.rightButton= false
        this.nameSignIn = ''
        this.emailSignIn = ''
        this.passwordSignIn= ''
      })
      .catch(err => {
        this.alert.alertMsg = true
        if(err.message.includes("needs verification") ){
          this.alert.alertMsgText  = "Please verify your email..."
          this.alert.alertMsgType = "warning";

          this.boxSignUp.leftHeader1=  "Your email needs varification",
          this.boxSignUp.leftHeader5= this.nameSignIn + ", please verify your email first",
          this.boxSignUp.leftBarColor= "warning",
          this.boxSignUp.rightHeader1="Registered Email",
          this.boxSignUp.rightHeader5="verify your email first",
          this.boxSignUp.rightButton= false

        }else{
          this.alert.alertMsgText  = err.message
          this.alert.alertMsgType = "error";

          this.boxSignUp.leftHeader1="your email is registered",
          this.boxSignUp.leftHeader5= this.nameSignIn + ", please proceed to Sign In",
          this.boxSignUp.leftBarColor= "error",
          this.boxSignUp.rightHeader1="Registered Email",
          this.boxSignUp.rightHeader5="Please proceed to Sign In",
          this.boxSignUp.rightButton= false
        }
      })
    },
    async postLogin() {
      let _self = this
      let data = {strategy: "local", email: this.emailLogin, password: this.passwordLogin }
      this.$auth.loginWith('local', {data: data}).then((response) => {
        this.$auth.setUserToken(response.data.accessToken)
        this.$auth.setUser(response.data.user)
        _self.authenticateSocket(data).then((res) =>{
        _self.$router.push('/')
        })
      }).catch((err) =>{
        this.alert.alertMsgText = err.response.data.message
        this.alert.alertMsg = true;
        this.alert.alertMsgType = "error";
        console.log(err)
      })
    }
  },
  watch:{
    step(newVal){
        this.nameSignIn = ''
        this.emailSignIn = ''
        this.passwordSignIn = ''
        this.emailLogin = ''
        this.passwordLogin = ''
        this.boxSignUp = {
          leftHeader1:"Welcome Back!",
          leftHeader5:"To keep connected with us, Please login with your personal info",
          leftBarColor: "blue",
          rightHeader1:"Create Account",
          rightHeader5:"Ensure your email for registration",
          rightButton: true
        }
    }
  }
}
</script>
