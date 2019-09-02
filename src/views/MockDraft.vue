<template>
  <v-container>
    <v-row>
      <v-col class='white--text' md='2'>
        <h3 class="mb-7">Your Team:</h3>
        <p>Draft Size: {{ this.user.size }}</p>
        <p>Pick Position: {{ this.user.pos }}</p>
        <p>WR: {{ this.user.wr }}</p>
        <p>RB: {{ this.user.rb }}</p>
        <p>FLEX: {{ this.user.flex }}</p>
      </v-col>
      <v-col class="white--text" md='2'>
        <h3 class="mb-7">Team #:</h3>
      </v-col>
      <v-col class="white--text" md='3'>
        <h3 class="mb-7">Players Available</h3>
        <v-list max-height="400px" class="overflow-y-auto">
          <v-list-item v-for="player in rankings" :key="player.name" @click="displayInfo(player)">
            <span class="green--text">{{ player.rank }}.&nbsp;</span> {{ player.name }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="white--text" md='3'>
        <h3 class="mb-7">Player Statistics</h3>
        <v-list v-if="display">
          <v-list-item>
            {{ display.Player }}
          </v-list-item>
          <v-list-item>
            Team: <span class="green--text">&nbsp;{{ display.Tm }}</span>
          </v-list-item>
          <v-list-item>
            Position: <span class="green--text">&nbsp;{{ display.FantPos }}</span>
          </v-list-item>
          <v-list-item>
            2018 Position Rank: <span class="green--text">&nbsp;{{ display.PosRank }}</span>
          </v-list-item>
          <v-list-item>
            2018 Points: <span class="green--text">&nbsp;{{ display.PPR }}</span>
          </v-list-item>
          <v-list-item>
            2018 PPG: <span class="green--text">&nbsp;{{ display.PPR / display.G | round(2) }}</span>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="white--text" md='2'>
        <h3 class="mb-7">Draft Feed</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ff2018 from '../assets/2018yearlyFF.json'
import rankings2019 from '../assets/rankings.json'
import db from '@/firebase/init'
import firebase from 'firebase'
import round from 'vue-round-filter'

export default {
  name: 'Home',
  data() {
    return {
      stat2018: ff2018,
      rankings: rankings2019,
      user: null,
      display: null
    }
  },
  filters: {
    round
  },
  methods: {
    displayInfo(person) {
      ff2018.forEach(player => {
        if (player.Player == person.name) {
          this.display = player
        }
      })
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

    let ref = db.collection('users')
    ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
    .then(snapshot => {
    snapshot.forEach(doc => {
        this.user = doc.data(),
        this.user.id = doc.id
        console.log(this.user)
    })
    })
  }
};
</script>
