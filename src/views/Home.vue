<template>
  <v-container>
    <v-row>
      <v-col class='white--text' offset-md='1' md='2'>
        Your Team:
      </v-col>
      <v-col class="white--text" md='2'>
        Team #:
      </v-col>
      <v-col class="white--text" md='2'>
        <h3 class="mb-7">Players Available</h3>
        <v-list max-height="400px" class="overflow-y-auto">
          <v-list-item v-for="player in stat2018" :key="player.Player">
            {{ player.Player }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="white--text" md='2'>
        Player Statistics
      </v-col>
      <v-col class="white--text" md='2'>
        Draft Feed
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ff2018 from '../assets/2018yearlyFF.json'

export default {
  name: 'Home',
  data() {
    return {
      stat2018: ff2018
    }
  },
  created() {
    // Adjust name formatting for every player
    var i
    ff2018.forEach((player) => {
      for (i = 0; i < player.Player.length; i++) {
        if (player.Player[i] == '*' || player.Player[i] == '\\') {
          player.Player = player.Player.slice(0,i)
        }
      }
    })
  }
};
</script>
