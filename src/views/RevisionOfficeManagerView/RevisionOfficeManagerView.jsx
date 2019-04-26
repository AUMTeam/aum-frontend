import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeliveryTable from '../../components/DeliveryTable/DeliveryTable';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import { viewStyles } from '../styles';
import { REVISION_OFFICE_MANAGER_ACTION_TYPE } from '../../redux/actions/views/revisionOfficeManager';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import { retrieveElementFromListState } from '../../utils/viewUtils';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import { renderElementFieldContent } from '../../utils/viewUtils';

const detailsDialogFields = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, label: 'Titolo' },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION, label: 'Descrizione' },
  { key: COMMON_ELEMENT_ATTRIBUTE.BRANCH, label: 'Branch' },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS, label: 'Componenti' },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR, label: 'Richiedente' },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Approvata da' },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP, label: 'Data creazione' },
  { key: COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, label: 'Data approvazione' },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE, label: 'Tipo di installazione' },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_LINK, label: 'Link al file di installazione' }
];

class RevisionOfficeManagerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsModalOpen: false,
      deliverModalOpen: false,
      currentlyShowingElement: {}
    };
  }

  componentDidMount() {
    this.props.startSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
  }

  componentWillUnmount() {
    this.props.stopSendRequestsListUpdatesAutoChecking(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]);
    this.props.resetUI();
  }

  render() {
    const { classes, sendRequestsData, retrieveSendRequestsListPage, performNewSearch, viewState } = this.props;
    const { detailsModalOpen, deliverModalOpen, currentlyShowingElement } = this.state;

    return (
      <>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Paper className={classes.paper}>
                <DeliveryTable
                  tableData={sendRequestsData.listPages}
                  itemsCount={sendRequestsData.totalItemsCount}
                  isLoading={sendRequestsData.isLoadingList}
                  latestUpdateTimestamp={sendRequestsData.latestUpdateTimestamp}
                  displayError={sendRequestsData.errorWhileFetchingData}
                  loadPage={(pageNumber, sortingCriteria, filter) => {
                    retrieveSendRequestsListPage(
                      USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER],
                      pageNumber,
                      sortingCriteria,
                      filter
                    );
                  }}
                  onSearchQueryChange={searchQuery => {
                    performNewSearch(
                      retrieveSendRequestsListPageAction(USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]),
                      searchQuery
                    );
                  }}
                  onElementDelivery={elementId => console.log(`To be implemented: Invio dell'elemento ${elementId}`)}
                  onElementClick={(pageNumber, rowIndex, elementId) => {
                    this.setState({
                      detailsModalOpen: true,
                      currentlyShowingElement: retrieveElementFromListState(
                        sendRequestsData,
                        pageNumber,
                        rowIndex,
                        elementId
                      )
                    });
                  }}
                  successfullyDeliveredElements={viewState.successfullyDeliveredElements}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <ElementDetailsDialog
          open={detailsModalOpen}
          dialogTitle={`Richiesta di invio #${currentlyShowingElement.id}`}
          element={currentlyShowingElement}
          elementFields={detailsDialogFields}
          renderFieldContent={renderElementFieldContent}
          onClose={() => this.setState({ detailsModalOpen: false })}
        />
      </>
    );
  }
}

RevisionOfficeManagerView.displayName = 'RevisionOfficeManagerView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].sendRequests,
    viewState: state.views[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]]
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      resetUI: () => ({ type: REVISION_OFFICE_MANAGER_ACTION_TYPE.RESET_UI })
    },
    dispatch
  );
};

export default withErrorBoundary(
  withStyles(viewStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(RevisionOfficeManagerView)
  )
);
