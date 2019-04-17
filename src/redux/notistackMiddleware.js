/* eslint-disable default-case */
import { LIST_ACTION_TYPE } from './actions/lists';
import { LIST_ELEMENTS_TYPE } from '../constants/api';
import { AUTH_ACTION_TYPE } from './actions/auth';

/**
 * Returns the middleware function created using the given notistack's enqueueSnackbar function.
 * This Redux middleware displays snackbars according to the dispatched action. Then forwards
 * the action to the reducer.
 * To learn more about how middlewares work head to https://redux.js.org/advanced/middleware
 */
export function createNotistackMiddleware(enqueueSnackbar) {
  return ({ getState, dispatch }) => next => action => {
    switch (action.type) {
      case LIST_ACTION_TYPE.UPDATE_CHECKING_ERROR:
        enqueueSnackbar(
          'Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione.',
          { variant: 'error', autoHideDuration: 5000, preventDuplicate: true }
        );
        break;
      case LIST_ACTION_TYPE.ELEMENT_REVIEW_FAILED:
        enqueueSnackbar(
          `Revisione del${
            action.elementType === LIST_ELEMENTS_TYPE.COMMITS ? ' commit' : 'la richiesta di invio'
          } #${action.elementId} fallita.`,
          { variant: 'error', autoHideDuration: 2500 }
        );
        break;
      case AUTH_ACTION_TYPE.LOGIN_FAILED:
        enqueueSnackbar("Impossibile effettuare l'accesso: " + action.errorMessage, {
          variant: 'error',
          autoHideDuration: 5000
        });
        break;
      case LIST_ACTION_TYPE.PAGE_RETRIEVAL_ERROR:
        enqueueSnackbar('Impossibile caricare la pagina: ' + action.errorMessage, {
          variant: 'error',
          autoHideDuration: 5000
        });
        break;
    }
    next(action);
  };
}
