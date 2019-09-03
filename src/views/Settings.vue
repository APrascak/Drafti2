<template>
    <v-container>
        <h3 class="mt-2">Email: <span v-if="user">{{ user.user_email }}</span></h3>
        <h3>Username: <span v-if="user">{{ user.username }}</span></h3>
        <h3 class="mt-3">Draft Settings: </h3>
        <div v-if="user">
            <p class="mt-2">
                <span>Player #: </span>
                <v-icon class="mx-2 green--text" @click="decPlayer()">
                    mdi-minus-circle-outline
                </v-icon>
                <span>{{ user.size }}</span>
                <v-icon class="ml-2 green--text" @click="incPlayer()">
                    mdi-plus-circle-outline
                </v-icon>
            </p>
            <p class="mt-1">
                <span>Pick Position: </span>
                <v-icon class="mx-2 green--text" @click="decPos()">
                    mdi-minus-circle-outline
                </v-icon>
                <span>{{ user.pos }}</span>
                <v-icon class="ml-2 green--text" @click="incPos()">
                    mdi-plus-circle-outline
                </v-icon>
            </p>
            <p class="mt-1">
                <span>Number of RBs: </span>
                <v-icon class="mx-2 green--text" @click="decRB()">
                    mdi-minus-circle-outline
                </v-icon>
                <span>{{ user.rb }}</span>
                <v-icon class="ml-2 green--text" @click="incRB()">
                    mdi-plus-circle-outline
                </v-icon>
            </p>
            <p class="mt-1">
                <span>Number of WRs: </span>
                <v-icon class="mx-2 green--text" @click="decWR()">
                    mdi-minus-circle-outline
                </v-icon>
                <span>{{ user.wr }}</span>
                <v-icon class="ml-2 green--text" @click="incWR()">
                    mdi-plus-circle-outline
                </v-icon>
            </p>
            <p class="mt-1">
                <span>Number of FLEX: </span>
                <v-icon class="mx-2 green--text" @click="decFlex()">
                    mdi-minus-circle-outline
                </v-icon>
                <span>{{ user.flex }}</span>
                <v-icon class="ml-2 green--text" @click="incFlex()">
                    mdi-plus-circle-outline
                </v-icon>
            </p>
        </div>
        <v-btn class="black--text" color="green" @click="updateSettings()">Update Settings</v-btn>
        <v-snackbar v-model="snackbar" class="white--text" color="green" top>
            Your settings have been updated!
        </v-snackbar>
        <v-snackbar class="black--text" v-model="error" color="red" top>
            {{ errorMsg }}
        </v-snackbar>
    </v-container>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Settings',
    data() {
        return {
            user: null,
            snackbar: false,
            error: null,
            errorMsg: ''
        }
    },
    methods: {
        incPlayer() {
            if (this.user.size < 16) {
                this.user.size++
            } else {
                this.error = true
                this.errorMsg = 'Your draft cannot have more than 16 players.'
            }
        },
        decPlayer() {
            if (this.user.size > 8) {
                this.user.size--
                if (this.user.pos > this.user.size) {
                    this.user.pos--
                }
            } else {
                this.error = true
                this.errorMsg = 'Your draft cannot have less than 8 players.'
            }
        },
        incPos() {
            if (this.user.pos < this.user.size) {
                this.user.pos++
            } else {
                this.error = true
                this.errorMsg = 'Your position cannot be any higher.'
            }
        },
        decPos() {
            if (this.user.pos > 1) {
                this.user.pos--
            } else {
                this.error = true
                this.errorMsg = 'You cannot draft lower than position 1.'
            }
        },
        incRB() {
            if (this.user.rb < 2) {
                this.user.rb++
            } else {
                this.error = true
                this.errorMsg = 'A team cannot have more than 2 RBs.'
            }
        },
        decRB() {
            if (this.user.rb > 0) {
                this.user.rb--
            } else {
                this.error = true
                this.errorMsg = 'A team cannot negative RBs.'
            }
        },
        incWR() {
            if (this.user.wr < 2) {
                this.user.wr++
            } else {
                this.error = true
                this.errorMsg = 'A team cannot have more than 2 WRs.'
            }
        },
        decWR() {
            if (this.user.wr > 0) {
                this.user.wr--
            } else {
                this.error = true
                this.errorMsg = 'A team cannot have negative WRs.'
            }
        },
        incFlex() {
            if (this.user.flex < 2) {
                this.user.flex++
            } else {
                this.error = true
                this.errorMsg = 'A team cannot have more than 2 FLEXs.'
            }
        },
        decFlex() {
            if (this.user.flex > 0) {
                this.user.flex--
            } else {
                this.error = true
                this.errorMsg = 'A team cannot negative FLEXs.'
            }
        },
        updateSettings() {
            db.collection('users').where('user_id','==',this.user.user_id)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('users').doc(doc.id).update({
                        size: this.user.size,
                        pos: this.user.pos,
                        wr: this.user.wr,
                        rb: this.user.rb,
                        flex: this.user.flex
                    }).then(this.snackbar="true")
                })
            })
        }
    },
    created() {
        let ref = db.collection('users')
        // get current user
        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
        snapshot.forEach(doc => {
            this.user = doc.data(),
            this.user.id = doc.id
        })
        })
    }
}
</script>