<template>
        <ion-item lines="none" button="true" detail="true" :router-link="`/visualization/${temporaryId}`">
            <ion-thumbnail slot="start">
                <img src="../../../public/assets/gradients/workout_track.jpg">
            </ion-thumbnail>

            <ion-label>
                <h3>{{ itemTitle }}</h3>
                <p>{{ formattedDate }}</p>
            </ion-label>
        </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonThumbnail } from '@ionic/vue'
import moment from 'moment'

export default {
    components: {
        IonItem,
        IonLabel,
        IonThumbnail
    },
    data() {
        return {
            formattedDate: '',
            temporaryId: ''
        }
    },
    props: ['itemTitle', 'itemDate'],
    methods: {
    },
    created() {
        // Format date
        this.formattedDate = moment(this.itemDate).format('DD/MM/YYYY');

        //Id for component
        this.temporaryId = Math.random();
    }
}
</script>

<style lang="sass" scoped>
ion-item 
    padding: 1rem 0

    ion-thumbnail
        display: flex
        justify-content: center
        align-items: center
        width: 20%
        height: auto

        img 
            width: 80%
            height: auto

    ion-label
        padding-left: .75rem

        h3
            font-family: 'Red Hat Display', sans-serif
            font-style: italic
            font-weight: 700
            font-size: 1.45rem

            padding-bottom: 3.5%
        p
            color: lightgrey
            font-size: .8rem
</style>