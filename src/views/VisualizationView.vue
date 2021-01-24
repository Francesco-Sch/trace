<template>
    <base-layout>
        <template v-slot:content>
            <p5-wrapper></p5-wrapper>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import p5Wrapper from '../components/p5js/p5Wrapper.vue';
import { mapActions } from 'vuex';

export default {
    components: {
        BaseLayout,
        p5Wrapper
    },
    data() {
        return {
            workoutID: this.$route.params.id,
            currentWorkout: null,
        }
    },
    methods: {
        ...mapActions(['fetchHeartrate', 'fetchSteps'])
    },
    computed: {

    },
    async created() {
        this.currentWorkout = await this.$store.getters.runningSession(this.workoutID);
        
        let tempStartDate = Date.parse(this.currentWorkout.startDate);
        let tempEndDate = Date.parse(this.currentWorkout.endDate);

        this.fetchHeartrate({
            startDate: tempStartDate, 
            endDate: tempEndDate,
            id: this.workoutID
        });
        this.fetchSteps({
            startDate: tempStartDate, 
            endDate: tempEndDate,
            id: this.workoutID
        });
    }
}
</script>