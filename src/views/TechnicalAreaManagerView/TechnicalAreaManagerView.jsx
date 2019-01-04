import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import {
  retrieveCommitsListPageAction,
  startCommitsListUpdatesAutoCheckingAction,
  stopCommitsListUpdatesAutoCheckingAction
} from '../../redux/actions/commits';
import { performNewSearchAction } from '../../redux/actions/lists';
import { viewStyles } from '../styles';
import RevisionTable from '../../components/RevisionTable';
import Snackbar from '@material-ui/core/SnackbarContent';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Grid from '@material-ui/core/Grid';
import { LIST_ELEMENTS_TYPE } from '../../constants/api';
import { APPROVAL_STATUS } from '../../constants/listElements';

class TechnicalAreaManagerView extends React.Component {
  constructor(props) {
    super(props);

    props.startCommitsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]);
  }

  render() {
    const { classes, commitsData, retrieveCommitsListPage, performNewSearch } = this.props;
    return (
      <>
        <Grid container className={classes.grid}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <RevisionTable
                tableData={commitsData.listPages}
                elementType={LIST_ELEMENTS_TYPE.COMMITS}
                itemsCount={commitsData.totalItemsCount}
                isLoading={commitsData.isLoadingList}
                latestUpdateTimestamp={commitsData.latestUpdateTimestamp}
                displayError={commitsData.errorWhileFetchingData}
                loadPage={(pageNumber, sortingCriteria, filter) => {
                  retrieveCommitsListPage(
                    USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER],
                    pageNumber,
                    sortingCriteria,
                    filter
                  );
                }}
                onSearchQueryChange={searchQuery => {
                  performNewSearch(
                    retrieveCommitsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]),
                    searchQuery
                  );
                }}
                onItemReview={(elementId, approvalStatus) =>
                  console.log(
                    `Commit ${elementId} ${approvalStatus === APPROVAL_STATUS.APPROVED ? 'approved' : 'rejected'}`
                  )
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* looks broken when it should be closed, why?
        <Snackbar open={commitsData.errorWhileCheckingUpdates}>
          <SnackbarContent
            className={classes.errorSnackbar}
            message="Impossibile controllare gli aggiornamenti per la lista. Controlla la tua connessione."
          />
        </Snackbar>*/}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    commitsData: state[USER_ROLE_STRING[USER_TYPE_ID.TECHNICAL_AREA_MANAGER]].commits
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveCommitsListPage: retrieveCommitsListPageAction,
      startCommitsListUpdatesAutoChecking: startCommitsListUpdatesAutoCheckingAction,
      stopCommitsListUpdatesAutoChecking: stopCommitsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction
    },
    dispatch
  );
};

export default withStyles(viewStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TechnicalAreaManagerView)
);
