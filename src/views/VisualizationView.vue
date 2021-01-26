<template>
    <base-layout>
        <template v-slot:content>
            <p5-wrapper 
            v-show="this.currentWorkout.steps"
            :startDate="this.currentWorkout.startDate"
            :endDate="this.currentWorkout.endDate"
            :calories="this.currentWorkout.calories"
            :distance="this.currentWorkout.distance"
            :heartrate="this.currentWorkout.heartrate"
            :steps="this.currentWorkout.steps"
            >
            </p5-wrapper>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import p5Wrapper from '../components/p5js/p5Wrapper.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        BaseLayout,
        p5Wrapper
    },
    data() {
        return {
            workoutID: this.$route.params.id,
            currentWorkout: null,
            hasData: false
        }
    },
    methods: {
        ...mapActions(['fetchHeartrate', 'fetchSteps'])
    },
    computed: {
        ...mapGetters(['runningSession'])
    },
    async created() {
        this.currentWorkout = await this.runningSession(this.workoutID);
        
        // Start and 
        let tempStartDate = Date.parse(this.currentWorkout.startDate);
        let tempEndDate = Date.parse(this.currentWorkout.endDate);

        // Fetches heartrate of workout
        await this.fetchHeartrate({
            startDate: tempStartDate, 
            endDate: tempEndDate,
            id: this.workoutID
        });
        // Fetches steps of workout
        await this.fetchSteps({
            startDate: tempStartDate, 
            endDate: tempEndDate,
            id: this.workoutID
        });

        // Reloads data with heartrate and steps
        this.currentWorkout = await this.runningSession(this.workoutID);
        this.hasData = true;

    }
}
</script>