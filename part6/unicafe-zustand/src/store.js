import {create} from 'zustand'

const useCounterStore = create(set => ({
  counter: {
    good: 0,
    neutral: 0,
    bad: 0
  },
  increment: (type) => set(state => ({
    counter: {
      ...state.counter,
      [type]: state.counter[type] + 1
    }
  }))

}))

export const useCounter = () => useCounterStore(state => state.counter)
export const useIncrement = () => useCounterStore(state => state.increment)