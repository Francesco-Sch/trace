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

export default {
    components: {
        BaseLayout,
        p5Wrapper
    }
}
</script>