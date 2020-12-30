<template>
    <base-layout>
        <template v-slot:content>
            <h2>Workouts</h2>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'

export default {
    components: {
        BaseLayout
    },
    mounted() {
        console.log(this.$store.dispatch('getActivites'))
    }
}
</script>

<style lang="sass" scoped>
</style>