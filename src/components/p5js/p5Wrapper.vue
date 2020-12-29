<template>
    <div id="p5canvas"></div>
</template>

<script>
import P5 from 'p5';
import { p5Sketch } from '../../p5scripts/visualization.js';

export default {
    data() {
        return {
            workouts: null,
        }
    },
    mounted() {
        new P5(p5Sketch);
        this.workouts = this.$store.getters.getWorkouts;

        console.log(this.workouts);
    }
}
</script>

<style scoped>
#p5canvas {
    width: 100%;
    height: 100%;
}
#p5canvas .p5Canvas {
    width: 100% !important;
    height: 100% !important;
}
</style>