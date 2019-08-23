<template>
  <v-container>
    <v-row>
      <v-col md="4">
        <h2>Login</h2>
        <v-form>
          <v-text-field
              class="mt-4"
              solo
              label="Email"
              clearable
              v-model="logUser"
            ></v-text-field>
            <v-text-field
              solo
              label="Password"
              clearable
              v-model="logPW"
            ></v-text-field>
            <v-btn small color="green" justify="center" @click="login">Login</v-btn>
        </v-form>
      </v-col>
      <v-col offset-md="2" md="4">
        <h2 class="center">Sign Up</h2>
        <v-text-field
          class="mt-4"
          solo
          label="Username"
          clearable
          v-model="username"
        ></v-text-field>
        <v-text-field
          solo
          label="Email"
          clearable
          v-model="email"
        ></v-text-field>
        <v-text-field
          solo
          label="Password"
          clearable
          v-model="password"
        ></v-text-field>
        <v-btn small color="green" @click="signup()">Signup</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
  name: 'Home',
  data() {
    return {
      username: null,
      email: null,
      password: null,
      feedback: null,
      logUser: null,
      logPW: null
    }
  },
  methods: {
    signup() {
      if (this.email && this.password) {
        this.slug = slugify(this.username, {
          replacement: '-',
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        })
        let ref = db.collection('users').doc(this.slug)
        ref.get().then(doc => {
          if (doc.exists) {
            this.feedback = 'This email is already in use'
          } else {
            firebase.auth().createUserWithEmailAndPassword(
            this.email,this.password)
            .then(cred => {
              console.log(cred)
              ref.set({
                user_id: cred.user.uid,
                slug: this.slug,
                user_email: cred.user.email,
                username: this.username,
                size: 10,
                pos: 1,
                rb: 2,
                wr: 2,
                flex: 1
              })
            }).then(() => {
              this.$router.push({ name: 'Home' })
            })
            .catch(err => {
              console.log(err)
              this.feedback = err.message
            })
          }
        })
      } else {
        this.feedback = 'You must enter both a username and a password.'
      }
    },
    login() {
      if (this.logUser && this.logPW) {
        firebase.auth().signInWithEmailAndPassword(this.logUser, this.logPW)
        .then(cred => {
          console.log(cred.user)
          this.logUser = null
          this.logPW = null
          this.$router.push({ name: 'Settings', params: { id: this.user.uid}})
        })
        .catch(err => {
          this.feedback = err.message
        })
        this.feedback = null

      } else {
        this.feedback = 'Please fill in both fields'
      }
    }
  },
  created() {
    
  }
};
</script>
