<template>
    <base-layout 
    :withHeader="true" 
    :navigationTitle="'Workouts'"
    :contentUnderHeader="false">
        <template v-slot:content>
            <ion-list-header>
                <ion-label>Your last Workouts</ion-label>
            </ion-list-header>

            <ion-list v-show="runningSessions">
                <workout-list-item 
                v-for="session in runningSessions"
                :key="session.distance"
                :itemTitle="'Running-Session'"
                :itemDate="session.startDate"
                :itemID="session.id">
                </workout-list-item>
            </ion-list>
        </template>
    </base-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from '../layouts/BaseLayout.vue'
import WorkoutListItem from '../components/workouts/WorkoutListItem.vue'
import { IonList, IonListHeader, IonLabel, loadingController } from '@ionic/vue';

export default {
    components: {
        BaseLayout,
        WorkoutListItem,
        IonList,
        IonListHeader,
        IonLabel,
    },
    data() {
        return {} 
    },
    methods: {
        ...mapActions(['fetchRunningDays', 'fetchRunningActivites']),

        async presentLoading() {
            const loading = await loadingController
                .create({
                    spinner: 'crescent',
                    cssClass: 'workout-loading',
                });

            await loading.present();
        },
        async destroyLoading() {
            await loadingController.dismiss()
        }
    },
    computed: {
        ...mapGetters(['runningSessions']),
    },
    async created() {
        this.presentLoading()

        await this.fetchRunningDays();
        await this.fetchRunningActivites();

        this.destroyLoading()
    },
    watch() {
    }

}
</script>

<style lang="sass" scoped>
ion-list-header ion-label 
    font-family: 'Red Hat Display', sans-serif
    font-weight: 700
    font-size: 2rem
</style>