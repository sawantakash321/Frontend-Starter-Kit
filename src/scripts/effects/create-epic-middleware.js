import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operator/map';
import { switchMap } from 'rxjs/operator/switchMap';

import { ActionsObservable } from './actions-observable';
import { EPIC_END } from './constants';

const defaultAdapter = {
  input: action$ => action$,
  output: action$ => action$
};

const defaultOptions = {
  adapter: defaultAdapter
};

export function createEpicMiddleware(epic, { adapter = defaultAdapter } = defaultOptions) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware');
  }

  const input$ = new Subject();
  const action$ = adapter.input(
    new ActionsObservable(input$)
  );
  const epic$ = new Subject();
  let store;

  const epicMiddleware = _store => {
    store = _store;

    return next => {
      epic$
        ::map(epic => {
          const output$ = epic(action$, store);
          if (!output$) {
            throw new TypeError(
              `Your root Epic "${epic.name || '<anonymous>'}" does not return a
              stream. Double check you\'re not missing a return statement!
            `);
          }
          return output$;
        })
        ::switchMap(output$ => adapter.output(output$))
        .subscribe(store.dispatch);

      epic$.next(epic);

      return action => {
        const result = next(action);
        input$.next(action);
        return result;
      };
    };
  };

  epicMiddleware.replaceEpic = (epic) => {
    store.dispatch({ type: EPIC_END });
    epic$.next(epic);
  };

  return epicMiddleware;
}
