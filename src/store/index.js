import { createStore } from 'vuex'
import { Health } from '@ionic-native/health';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

const store = createStore({
    state: () => ({
        isLoggedIn: false,
        daysWithRunning: [],
        runningActivites: []
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
        getRunningActivites() {
            Health.queryAggregated({
                startDate: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000), // two week ago
                endDate: new Date(), // now
                dataType: 'activity',
                bucket: 'day'
            })
            .then(res => {
                // Filter for running activites
                // and save them in state
                this.daysWithRunning = res.filter(function(el) {
                    if(typeof el.value["running.jogging"] !== 'undefined' || typeof el.value.running !== 'undefined') {
                        return el
                    }
                })
                console.log(this.daysWithRunning)
            })
            .catch(err => console.log('err activites: ' + err))
            .then(() => {
                let runningActivites = [];

                for(let i = 0; i < this.daysWithRunning.length; i++) {
                    Health.query({
                        startDate: this.daysWithRunning[i].startDate,
                        endDate: this.daysWithRunning[i].endDate,
                        dataType: 'activity',
                        limit: 500
                    })
                    .then(res =>{
                        let runningActivity = res.filter(function(el) {
                            if(el.value == 'running.jogging' || el.value == 'running') {
                                return el
                            }
                        })
                        runningActivites.push.apply(runningActivites ,runningActivity)
                    })
                    .catch(err => console.log('err runningActivites: ' + err))
                }
                
                this.runningActivites = runningActivites
            })
        }
    }
})

export default store