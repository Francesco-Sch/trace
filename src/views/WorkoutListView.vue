<template>
    <base-layout :navigationTitle="'List of Workouts'">
        <template v-slot:content>
            <ion-list>
                <!-- <workout-list-item></workout-list-item> -->
            </ion-list>
        </template>
    </base-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from '../layouts/BaseLayout.vue'
//import WorkoutListItem from '../components/workouts/WorkoutListItem.vue'
import { IonList, } from '@ionic/vue';

export default {
    components: {
        BaseLayout,
        //WorkoutListItem,
        IonList
    },
    data() {
        return {
            runningDays: [],
            runningSessions: []
        }
    },
    methods: {
        ...mapActions(['fetchRunningDays', 'fetchRunningActivites']),
    },
    computed: {
        ...mapGetters([]),
    },
    async created() {
        await this.fetchRunningDays();
        this.fetchRunningActivites();
    }
}
</script>

<style lang="sass" scoped>
</style>