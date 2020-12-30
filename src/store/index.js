import { createStore } from 'vuex'
import { Health } from '@ionic-native/health';


const store = createStore({
    state: () => ({
        
    }),
    actions: {
        healthAuthentication() {
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
    }
})

export default store