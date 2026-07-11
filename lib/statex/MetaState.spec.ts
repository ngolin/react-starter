import { MetaState } from './MetaState';

const initialState = {
  age: 0,
  name: '',
  married: false,
  job: undefined as undefined | string,
  title: undefined,
};
type State = typeof initialState;

const updateState = {
  age: 28,
  name: 'John',
  married: true,
  job: 'Engineer',
  title: undefined,
};

const stateChannel = new MetaState<State>(initialState);
const subscribe = <K extends keyof State>(key: K, newValue: State[K], originalValue: State[K]) => {
  let callTime = 0;
  const unsubscribe = stateChannel.subscribe(key, value => {
    expect(value).toBe(newValue);
    unsubscribe();
    stateChannel.dispatch({ [key]: originalValue });
    callTime++;
  });
  return (callCount: number = 1) => {
    expect(callTime).toBe(callCount);
  };
};
describe('StateChannel', () => {
  test('StateChannel get type and value check', () => {
    stateChannel.dispatch(initialState);
    const state1: typeof initialState = stateChannel.get();
    const state2: number = stateChannel.get('age');
    const state3: string = stateChannel.get('name');
    const state4: boolean = stateChannel.get('married');
    const state5: string | undefined = stateChannel.get('job');
    const state6: undefined = stateChannel.get('title');
    const state7: [number, string] = stateChannel.get('age', 'name');
    expect(state1).not.toBe(initialState);
    expect(state1).toEqual(initialState);
    expect(state2).toBe(initialState.age);
    expect(state3).toBe(initialState.name);
    expect(state4).toBe(initialState.married);
    expect(state5).toBe(initialState.job);
    expect(state6).toBe(initialState.title);
    expect(state7).toEqual([initialState.age, initialState.name]);
  });

  test('StateChannel subscribe type and value check', () => {
    stateChannel.dispatch(initialState);

    const removable = [
      stateChannel.subscribe('age', value => {
        const age: number = value;
        expect(age).toBe(updateState.age);
      }),
      stateChannel.subscribe('name', value => {
        const name: string = value;
        expect(name).toBe(updateState.name);
      }),
      stateChannel.subscribe('married', value => {
        const married: boolean = value;
        expect(married).toBe(updateState.married);
      }),
      stateChannel.subscribe('job', value => {
        const job: string | undefined = value;
        expect(job).toBe(updateState.job);
      }),
      stateChannel.subscribe('title', value => {
        const title: undefined = value;
        expect(title).toBe(updateState.title);
      }),
    ];

    stateChannel.dispatch(updateState);
    for (const remove of removable) {
      remove();
    }
  });

  test('StateChannel dispatch with key and value', () => {
    const dispatch = <K extends keyof typeof initialState>(
      key: K,
      newValue: (typeof initialState)[K],
      callCount = 1,
    ) => {
      const originalValue = stateChannel.get(key);

      let expectCallCount = subscribe(key, newValue, originalValue);
      stateChannel.dispatch(key, newValue);
      expectCallCount(callCount);

      stateChannel.dispatch(key, oldValue => {
        const currentValue = stateChannel.get(key);
        expect(oldValue).toBe(currentValue);
        expectCallCount = subscribe(key, newValue, originalValue);
        return newValue;
      });
      expectCallCount(callCount);

      expectCallCount = subscribe(key, newValue, originalValue);
      stateChannel.dispatch({ [key]: newValue });
      expectCallCount(callCount);

      stateChannel.dispatch({
        [key]: (oldValue: State[K]) => {
          const currentValue = stateChannel.get(key);
          expect(oldValue).toBe(currentValue);
          expectCallCount = subscribe(key, newValue, originalValue);
          return newValue;
        },
      });
      expectCallCount(callCount);
    };
    stateChannel.dispatch(initialState);
    dispatch('age', updateState.age, 1);
    dispatch('name', updateState.name, 1);
    dispatch('married', updateState.married, 1);
    dispatch('job', updateState.job, 1);
    dispatch('title', updateState.title, 0);
    stateChannel.dispatch(updateState);
    dispatch('age', updateState.age, 0);
    dispatch('name', updateState.name, 0);
    dispatch('married', updateState.married, 0);
    dispatch('job', updateState.job, 0);
    dispatch('title', updateState.title, 0);
  });
});
