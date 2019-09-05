<template>
  <v-container>
    <v-row>
      <v-col class='white--text' md='2'>
        <h3 class="mb-7">Your Team:</h3>
        <v-list v-if="user">
          <v-list-item>
            <span class="green--text">QB</span>: {{ userTeam.qb }}
          </v-list-item>
          <v-list-item v-for="rb in user.rb" :key="rb">
            RB{{ rb }}: <span v-if="userTeam.rb[rb-1]">&nbsp;{{ userTeam.rb[rb-1].name }}</span>
          </v-list-item>
          <div>
            <v-list-item v-for="wr in user.wr" :key="wr">
              WR{{ wr }}:  <span v-if="userTeam.wr[wr-1]">&nbsp;{{ userTeam.wr[wr-1].name }}</span>
            </v-list-item>
          </div>
          <v-list-item>
            TE:
          </v-list-item>
          <div>
            <v-list-item v-for="flex in user.flex" :key="flex">
              FLEX{{ flex }}: <span v-if="userTeam.flex[flex-1]">&nbsp;{{ userTeam.flex[flex-1].name }}</span>
            </v-list-item>
          </div>
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
          <v-btn class="ma-3" justify="center" v-if="display" color="green" @click=draft(currDisplay)>Draft</v-btn>
        </div>
      </v-col>
      <v-col class="white--text" md='2'>
        <h3 class="mb-7">Draft Feed</h3>
      </v-col>
    </v-row>
    <v-snackbar class="black--text" v-model="error" color="red" top>
        {{ errorMsg }}
    </v-snackbar>
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
      currDisplay: null,
      team: null,
      currRound: 1,
      currPick: 1,
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
      viewTeam: null,
      picks: [],
      error: null,
      errorMsg: ''
    }
  },
  filters: {
    round
  },
  methods: {
    displayInfo(person) {
      this.currDisplay = person
      ff2018.forEach(player => {
        if (player.Player == person.name) {
          this.display = player
        }
      })
    },
    draft(player) {

      player.Round = this.currRound
      player.Pick = this.currPick
      player.OvPick = (this.currRound * this.user.size) + this.currPick - 10
      this.picks.push(player)

      if (player.pos == "QB" && !this.userTeam.qb) {
        this.userTeam.qb = player
      } else if (player.pos == 'RB' && this.userTeam.rb.length < this.user.rb) {
        this.userTeam.rb.push(player)
      } else if (player.pos == 'WR' && this.userTeam.wr.length < this.user.wr) {
        this.userTeam.wr.push(player)
      } else if (player.pos == 'TE' && !this.userTeam.te) {
        this.userTeam.te = player
      } else if ((player.pos == 'RB' || player.pos == 'WR' || player.pos == 'TE') && this.userTeam.flex.length < this.user.flex) {
        this.userTeam.flex.push(player)
      } else {
        this.error = true
        this.errorMsg = 'This position is full!'
        this.picks.pop()
        return;
      }
      this.rankings.splice(this.rankings.indexOf(player),1)

      if (this.currPick == this.user.size) {
        this.currRound++
        this.currPick = 1
      } else {
        this.currPick++
        var i
        if (this.currRound % 2 == 1) {
          for (i = this.currPick; i <= this.user.size; i++) {
            this.cpuDraft(this.otherTeams[i-2])
          }
          for (i = this.currPick; i <= (this.user.size - this.user.pos); i++) {
            this.cpuDraft(this.otherTeams[this.user.size - this.currPick-1])
          }
        } else {
          for (i = this.currPick; i <= this.user.size; i++) {
            this.cpuDraft(this.otherTeams[this.user.size - this.currPick])
          }
          for (i = this.currPick; i < this.user.pos; i++) {
            this.cpuDraft(this.otherTeams[i-1])
          }
        }
      }
    },
    cpuDraft(team) {

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
    }).then( () => {
      for(i = 1; i <= this.user.size; i++) {
        if (i != this.user.pos) {
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
      
    )
  }
};
</script>
