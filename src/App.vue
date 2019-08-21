<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item router :to="'/MockDraft'">
          <v-list-item-action @click="">
            <v-icon>mdi-football</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mock Draft</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
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
        Drafti<span class="green--text">.io</span>
        <!-- <v-icon color="green">mdi-football</v-icon> -->
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
  }),
  created () {
    this.$vuetify.theme.dark = true
  },
};
</script>