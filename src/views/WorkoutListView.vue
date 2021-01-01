<template>
    <base-layout :navigationTitle="'List of Workouts'">
        <template v-slot:content>
            <ion-list-header>
                <ion-label>Your last Workouts</ion-label>
            </ion-list-header>

            <ion-list>
                <workout-list-item 
                v-for="session in runningSessions"
                :key="session.distance"
                :itemTitle="'Running-Session'"
                :itemDate="session.startDate">
                </workout-list-item>
            </ion-list>
        </template>
    </base-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from '../layouts/BaseLayout.vue'
import WorkoutListItem from '../components/workouts/WorkoutListItem.vue'
import { IonList, IonListHeader, IonLabel } from '@ionic/vue';

export default {
    components: {
        BaseLayout,
        WorkoutListItem,
        IonList,
        IonListHeader,
        IonLabel
    },
    data() {
    },
    methods: {
        ...mapActions(['fetchRunningDays', 'fetchRunningActivites']),
    },
    computed: {
        ...mapGetters(['runningSessions']),
    },
    async created() {
        await this.fetchRunningDays();
        this.fetchRunningActivites();
    }
}
</script>

<style lang="sass" scoped>
ion-list-header ion-label 
    font-family: 'Red Hat Display', sans-serif
    font-weight: 700
    font-size: 2rem
</style>