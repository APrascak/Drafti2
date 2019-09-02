<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item @click="mockDraft()">
          <v-list-item-action>
            <v-icon>mdi-football</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mock Draft</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="settings">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="user" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span router :to="'/Home'">Drafti<span class="green--text">.io</span></span>
        </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container-fluid>
        <router-view></router-view>
      </v-container-fluid>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  name: 'App',
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    user: null
  }),
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Home' })
      })
    },
    settings() {
      if (this.user) {
        console.log(this.user)
        this.$router.push({ name: 'Settings', params: { id: this.user.uid}})
      }
    },
    mockDraft() {
      if (this.user) {
        this.$router.push({ name: 'mockdraft' })
      }
    }
  },
  created () {
    this.$vuetify.theme.dark = true
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  },
};
</script>