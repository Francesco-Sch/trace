import { createStore } from 'vuex'
import { Health } from '@ionic-native/health';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

const store = createStore({
    state: () => ({
        isLoggedIn: false,
        activites: []
    }),
    getters: {
        isLoggedIn: state => {
            return state.isLoggedIn
        }
    },
    mutations: {
        [LOGIN_SUCCESS](state) {
            state.isLoggedIn = true;
        }
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
            Health.query({
                startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // one week ago
                endDate: new Date(), // now
                dataType: 'activity',
                limit: 1000
            })
            .then(res => {
                console.log(res)
                this.state.activites = res;
            })
            .catch(err => console.log('err activites: ' + err))
        }
    }
})

export default store