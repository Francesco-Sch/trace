<template>
    <ion-header class="ion-no-border">
        <ion-toolbar>
            <ion-title>Navigation</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-content fullscreen="true">
        <slot name="content"></slot>
    </ion-content>
</template>

<script>
import { 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent 
    } from '@ionic/vue';

export default {
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent
    }
}
</script>

<style scoped>
ion-toolbar {
    --background: transparent;
    --ion-color-base: transparent !important;
}
</style>