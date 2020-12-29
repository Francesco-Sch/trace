import { createStore } from 'vuex'


const store = createStore({
    state() {
        return {
            workouts: [
                {
                    id: '1',
                    title: 'cooles Workout'
                },
                {
                    id: '2',
                    title: 'Noch ein cooles Workout'
                }
            ]
        }
    },
    getters: {
        getWorkouts(state) {
            return state.workouts;
        }
    }
})

export default store