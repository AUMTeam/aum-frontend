/* eslint-disable default-case */
import { LIST_ACTION_TYPE } from './actions/commonList';
import { ELEMENT_TYPE } from '../constants/api';
import { AUTH_ACTION_TYPE } from './actions/auth';
import { PROGRAMMER_ACTION_TYPE } from './actions/views/programmer';

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
          { variant: 'error', autoHideDuration: 4000, preventDuplicate: true }
        );
        break;
      case LIST_ACTION_TYPE.ELEMENT_REVIEW_FAILED:
        enqueueSnackbar(
          `Revisione del${
            action.elementType === ELEMENT_TYPE.COMMITS ? ' commit' : 'la richiesta di invio'
          } #${action.elementId} fallita.`,
          { variant: 'error', autoHideDuration: 3000 }
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
      case PROGRAMMER_ACTION_TYPE.ADD_ELEMENT_SUCCESSFUL:
        enqueueSnackbar('La richiesta è stata aggiunta correttamente.', {
          autoHideDuration: 5000
        });
        break;
      case PROGRAMMER_ACTION_TYPE.REMOVE_ELEMENT_SUCCESSFUL:
        enqueueSnackbar('La richiesta è stata rimossa con successo.', {
          autoHideDuration: 5000
        });
        break;
      case PROGRAMMER_ACTION_TYPE.REMOVE_ELEMENT_FAILED:
        enqueueSnackbar('Errore nella rimozione della richiesta: ' + action.errorMessage, {
          variant: 'error',
          autoHideDuration: 5000
        });
        break;
    }
    next(action);
  };
}
