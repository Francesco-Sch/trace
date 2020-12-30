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
                        read: ['steps', 'activity'],   //read only permission
                        write: []  //write only permission
                    }
                ])
                .then(res => {
                    console.log(res);
                    store.commit(LOGIN_SUCCESS); // sets Login status to logged in
                })
                .catch(err => console.log('error reqAuth: ' + err));
            })
            .catch(err => console.log('error auth: ' + err));
        },
        getActivites() {
            Health.queryAggregated({
                startDate: new Date(new Date().getTime() - 4 * 7 * 24 * 60 * 60 * 1000), // 4 weeks ago
                endDate: new Date(), // now
                dataType: 'activity',
                bucket: 'day'
            })
            .then(res => console.log(res))
            .catch(err => console.log('err activites: ' + err))
        }
    }
})

export default store