<template>
    <v-container>
        <h3 class="mt-2">Email: <span v-if="user">{{ user.user_email }}</span></h3>
        <h3>Username: <span v-if="user">{{ user.username }}</span></h3>
        <h3 class="mt-3">Draft Settings: </h3>
        <p class="mt-2">
            <span>Player #: </span>
            <v-icon class="mx-2 green--text">
                mdi-minus-circle-outline
            </v-icon>
            <span>8</span>
            <v-icon class="ml-2 green--text">
                mdi-plus-circle-outline
            </v-icon>
        </p>
        <p class="mt-1">
            <span>Pick Position: </span>
            <v-icon class="mx-2 green--text">
                mdi-minus-circle-outline
            </v-icon>
            <span>4</span>
            <v-icon class="ml-2 green--text">
                mdi-plus-circle-outline
            </v-icon>
        </p>
        <p class="mt-1">
            <span>Number of RBs: </span>
            <v-icon class="mx-2 green--text">
                mdi-minus-circle-outline
            </v-icon>
            <span>2</span>
            <v-icon class="ml-2 green--text">
                mdi-plus-circle-outline
            </v-icon>
        </p>
        <p class="mt-1">
            <span>Number of WRs: </span>
            <v-icon class="mx-2 green--text">
                mdi-minus-circle-outline
            </v-icon>
            <span>2</span>
            <v-icon class="ml-2 green--text">
                mdi-plus-circle-outline
            </v-icon>
        </p>
        <p class="mt-1">
            <span>Number of FLEX: </span>
            <v-icon class="mx-2 green--text">
                mdi-minus-circle-outline
            </v-icon>
            <span>1</span>
            <v-icon class="ml-2 green--text">
                mdi-plus-circle-outline
            </v-icon>
        </p>

    </v-container>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Settings',
    data() {
        return {
            user: null
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