<template>
    <base-layout :withHeader="false">
        <template v-slot:content>
            <div class ="login-wrapper">
                <img src="../../public/assets/logo/trace-logo_text_black.svg" alt="Trace logo in black" class="trace-logo">
                
                <ion-button 
                v-show="isLoggedIn"
                router-link="/workouts"
                expand="block" 
                color="dark" 
                >Enter app</ion-button>

                <ion-button 
                    v-show="!isLoggedIn" 
                    expand="block" 
                    color="dark" 
                    @click="requestAuthentication"
                >Login</ion-button>
            </div>
        </template>
    </base-layout>
</template>

<script>
import { IonButton } from '@ionic/vue'
import { mapGetters } from 'vuex'
import BaseLayout from '../layouts/BaseLayout.vue'

export default {
    components: {
        BaseLayout,
        IonButton
    },
    methods: {
        requestAuthentication() {
            this.$store.dispatch('healthAuthentication')
        }
    },
    computed: {
        ...mapGetters(['isLoggedIn'])
    },
    created() {
        this.requestAuthentication();
    }
}
</script>

<style lang="sass" scoped>
.login-wrapper
    display: flex
    flex-direction: column
    justify-content: center

    width: 100%
    height: 100%

    background-image: url('../../public/assets/gradients/sun-gradient_orange.svg')
    background-position: 50% 55%
    background-repeat: no-repeat
    background-size: 350%
    background-color: transparent
.trace-logo
    padding: 0 27.5%
    height: auto
    flex-grow: 1
ion-button
    margin: 5%
    margin-bottom: 7%
    --padding-top: 20px
    --padding-bottom: 20px

    font-weight: 700
</style>