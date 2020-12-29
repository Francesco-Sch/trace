<template>
    <div id="p5canvas"></div>
</template>

<script>
import P5 from 'p5';
import { p5Sketch } from '../../p5scripts/visualization.js';
import { Health } from '@ionic-native/health';


export default {
    data() {
    },
    methods: {
        healthAuthentication: () => {
            Health.isAvailable()
            .then((available) => {
                console.log(available);

                Health.requestAuthorization([
                    'distance', 'nutrition',  //read and write permissions
                    {
                        read: ['steps'],       //read only permission
                        write: ['height', 'weight']  //write only permission
                    }
                ])
                .then(res => console.log(res))
                .catch(e => console.log('error reqAuth: ' + e));
            })
            .catch(err => console.log('error auth: ' + err));
        }
    },
    mounted() {
        new P5(p5Sketch);
        this.healthAuthentication();
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