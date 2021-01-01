<template>
    <ion-page>
        <ion-header class="ion-no-border" v-if="withHeader">
            <ion-toolbar>
                <ion-title>{{ navigationTitle }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :class="{'static-position': contentUnderHeader}" fullscreen="true">
            <slot name="content"></slot>
        </ion-content>
    </ion-page>
</template>

<script>
import { 
    IonPage,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent 
    } from '@ionic/vue';

export default {
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent
    },
    props: {
        withHeader: {
            type: Boolean,
            default: true
        },
        contentUnderHeader: {
            type: Boolean,
            default: true
        },
        navigationTitle: {
            type: String,
            default: 'Navigation'
        }
    }
}
</script>

<style scoped>
ion-toolbar {
    --background: transparent;
    --ion-color-base: transparent !important;
}
.static-position {
    position: static;
}
</style>