import { createStore } from 'vuex'
import { Health } from '@ionic-native/health';

// Login objects
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// Fitness data objects
const SET_RUNNING_DAYS = 'SET_RUNNING_DAYS';
const SET_RUNNING_SESSIONS = 'SET_RUNNING_SESSIONS';

const store = createStore({
    state: () => ({
        isLoggedIn: false,
        runningDays: [],
        runningSessions: []
    }),
    getters: {
        isLoggedIn: state => {
            return state.isLoggedIn
        },
        runningDays: state => {
            return state.runningDays
        },
        runningSessions: state => {
            return state.runningSessions
        }
    },
    mutations: {
        // Login mutations
        [LOGIN_SUCCESS](state) {
            state.isLoggedIn = true;
        },

        // Fitness data mutations
        [SET_RUNNING_DAYS](state, activityDays) {
            const filteredRunningDays = activityDays.filter(
                activityDay => activityDay.value['running.jogging'] !== undefined ||
                activityDay.value.running !== undefined
            );
            
            state.runningDays = filteredRunningDays;
        },
        [SET_RUNNING_SESSIONS](state, sessions) {
            const filteredRunningSessions = sessions.filter(
                sessions => sessions.value == 'running.jogging' ||
                sessions.value == 'running'
            );
            
            console.log(filteredRunningSessions);
            state.runningSessions = filteredRunningSessions;
        }
    },
    actions: {
        healthAuthentication({ commit }) {
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
                    commit(LOGIN_SUCCESS); // sets Login status to logged in
                })
                .catch(err => console.log('error reqAuth: ' + err));
            })
            .catch(err => console.log('error auth: ' + err));
        },
        async fetchRunningDays({ commit }) {
            const response = await Health.queryAggregated({
                startDate: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000), // two week ago
                endDate: new Date(), // now
                dataType: 'activity',
                bucket: 'day'
            });

            commit(SET_RUNNING_DAYS, response);
        },
        async fetchRunningActivites({ commit, getters }) {
            const sessionsOnRunningDays = [];

            for(let i = 0; i < getters.runningDays.length; i++) {
                const response = await Health.query({
                    startDate: getters.runningDays[i].startDate,
                    endDate: getters.runningDays[i].endDate,
                    dataType: 'activity',
                    limit: 500
                })
                sessionsOnRunningDays.push.apply(sessionsOnRunningDays, response);
            }

            commit(SET_RUNNING_SESSIONS, sessionsOnRunningDays);
        }
    }
})

export default store