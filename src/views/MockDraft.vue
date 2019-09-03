<template>
  <v-container>
    <v-row>
      <v-col class='white--text' md='2'>
        <h3 class="mb-7">Your Team:</h3>
        <v-list>
          <v-list-item>
            <span class="green--text">QB</span>: {{ userTeam.qb }}
          </v-list-item>
          <v-list-item v-for="rb in user.rb" :key="rb">
            RB{{ rb }}: Test
          </v-list-item>
          <v-list-item v-for="wr in user.wr" :key="wr">
            WR{{ wr }}: Test
          </v-list-item>
          <v-list-item>
            TE:
          </v-list-item>
          <v-list-item v-for="flex in user.flex" :key="flex">
            FLEX{{ flex }}: Test
          </v-list-item>
          <v-list-item>
            D/ST: 
          </v-list-item>
          <v-list-item>
            K:
          </v-list-item>
        </v-list>
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
        <div class="text-center">
          <v-btn class="ma-3" justify="center" v-if="display" color="green" @click=draft(display)>Draft</v-btn>
        </div>
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
      display: null,
      team: null,
      userTeam: {
        qb: null,
        rb: [],
        wr: [],
        te: null,
        flex: [],
        dst: null,
        k: null
      },
      otherTeams: [],
      viewTeam: null
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
    },
    draft(player) {
      
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
    })
    })

    for(i = 1; i <= this.draftParams.playerNum; i++) {
      if (i != this.draftParams.pickPos) {
        this.otherTeams.push({
          name: Number(i),
          qb: null,
          rb: [],
          wr: [],
          te: null,
          flx: [],
          k: null,
          dst: null
        })
      }
    }

    for (i = 0; i < this.user.pos - 1; i++) {
      this.cpuDraft(this.otherTeams[i])
    }
  }
};
</script>
