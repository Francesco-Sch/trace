import { createStore } from 'vuex'
import { Health } from '@ionic-native/health';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

const store = createStore({
    state: () => ({
        isLoggedIn: false
    }),
    getters: {
        isLoggedIn: state => {
            return state.isLoggedIn
        }
    },
    mutations: {
        [LOGIN_SUCCESS](state) {
            state.isLoggedIn = true;
        },
    },
    actions: {
        healthAuthentication() {
            Health.isAvailable()
            .then((available) => {
                console.log(available);

                Health.requestAuthorization([
                    {
                        read: ['steps'],   //read only permission
                        write: ['height', 'weight']  //write only permission
                    }
                ])
                .then(res => {
                    console.log(res);
                    store.commit(LOGIN_SUCCESS); // sets Login status to logged in
                })
                .catch(err => console.log('error reqAuth: ' + err));
            })
            .catch(err => console.log('error auth: ' + err));
        }
    }
})

export default store