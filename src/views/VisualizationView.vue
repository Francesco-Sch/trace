<template>
    <base-layout>
        <template v-slot:content>
            <h2>Slotted Content</h2>
        </template>
    </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'

export default {
    components: {
        BaseLayout,
    }
}
</script>