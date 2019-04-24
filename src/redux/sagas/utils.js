import { cancel, delay, fork, race, take } from 'redux-saga/effects';

/**
 * A variation of Saga's debounce effect which cancels the task that has been executed
 * after the previous debounce if it's still running.
 * This can be seen as a mix between Saga's takeLatest and debounce effects.
 * Implementation based on the code found at https://redux-saga.js.org/docs/api/#debouncems-pattern-saga-args.
 */
export function strictDebounce(milliseconds, sagaPattern, task, ...taskArgs) {
  return fork(function*() {
    let lastExecutedTask;
    while (true) {
      let latestAction = yield take(sagaPattern);
      if (lastExecutedTask)
        yield cancel(lastExecutedTask);

      let debounced = false;
      while (!debounced) {
        let latestActionIfNotDebounced;
        [debounced, latestActionIfNotDebounced] = yield race([delay(milliseconds), take(sagaPattern)]);

        if (debounced)
          lastExecutedTask = yield fork(task, ...taskArgs, latestAction);
        else
          latestAction = latestActionIfNotDebounced;
      }
    }
  });
}
