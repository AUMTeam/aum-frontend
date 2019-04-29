import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeliveryDialog from '../../components/DeliveryDialog';
import DeliveryTable from '../../components/DeliveryTable/DeliveryTable';
import ElementDetailsDialog from '../../components/ElementDetailsDialog';
import withErrorBoundary from '../../components/WithErrorBoundary';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import { USER_ROLE_STRING, USER_TYPE_ID } from '../../constants/user';
import { performNewSearchAction } from '../../redux/actions/commonList';
import {
  retrieveSendRequestsListPageAction,
  startSendRequestsListUpdatesAutoCheckingAction,
  stopSendRequestsListUpdatesAutoCheckingAction
} from '../../redux/actions/sendRequests';
import {
  REVISION_OFFICE_MANAGER_ACTION_TYPE,
  deliverElementAction
} from '../../redux/actions/views/revisionOfficeManager';
import { renderElementFieldContent, retrieveElementFromListState } from '../../utils/viewUtils';
import { viewStyles } from '../styles';

const detailsDialogFields = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE },
  { key: COMMON_ELEMENT_ATTRIBUTE.DESCRIPTION },
  { key: COMMON_ELEMENT_ATTRIBUTE.BRANCH },
  { key: COMMON_ELEMENT_ATTRIBUTE.COMPONENTS },
  { key: SEND_REQUEST_ATTRIBUTE.LINKED_COMMITS },
  { key: SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER },
  { key: COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, label: 'Data approvazione' },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_LINK }
];

class RevisionOfficeManagerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsModalOpen: false,
      deliveryModalOpen: false,

      // must be set to an object when empty, otherwise render()
      // would throw an error (the id field is accessed in any case, see below)
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
    const {
      classes,
      sendRequestsData,
      retrieveSendRequestsListPage,
      performNewSearch,
      successfullyDeliveredElements,
      isDeliveringElement,
      latestDeliveryFailed
    } = this.props;
    const { detailsModalOpen, deliveryModalOpen, currentlyShowingElement } = this.state;

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
                  onElementDelivery={(elementId, pageNumber) => {
                    this.setState({
                      deliveryModalOpen: true,
                      currentlyShowingElement: retrieveElementFromListState(sendRequestsData, elementId, pageNumber)
                    });
                  }}
                  onElementClick={(pageNumber, rowIndex, elementId) => {
                    this.setState({
                      detailsModalOpen: true,
                      currentlyShowingElement: retrieveElementFromListState(
                        sendRequestsData,
                        elementId,
                        pageNumber,
                        rowIndex
                      )
                    });
                  }}
                  successfullyDeliveredElements={successfullyDeliveredElements}
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
          onClose={this.hideDetailsModal}
        />

        <DeliveryDialog
          key={currentlyShowingElement.id}
          open={deliveryModalOpen && !successfullyDeliveredElements.includes(currentlyShowingElement.id)}
          isLoading={isDeliveringElement}
          displayError={latestDeliveryFailed}
          sendRequest={currentlyShowingElement}
          onSend={(elementId, installLink) => this.props.deliverElement(elementId, installLink)}
          onClose={this.hideDeliveryModal}
          onDetailsClick={() => this.setState({ detailsModalOpen: true })}
        />
      </>
    );
  }

  hideDeliveryModal = () => {
    this.props.resetDeliveryFailedFlag();
    this.setState({ deliveryModalOpen: false });
  };

  hideDetailsModal = () => {
    this.setState({ detailsModalOpen: false });
  };
}

RevisionOfficeManagerView.displayName = 'RevisionOfficeManagerView';

const mapStateToProps = state => {
  return {
    sendRequestsData: state.lists[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].sendRequests,
    successfullyDeliveredElements:
      state.views[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].successfullyDeliveredElements,
    isDeliveringElement: state.views[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].isDeliveringElement,
    latestDeliveryFailed: state.views[USER_ROLE_STRING[USER_TYPE_ID.REVISION_OFFICE_MANAGER]].latestDeliveryFailed
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      retrieveSendRequestsListPage: retrieveSendRequestsListPageAction,
      startSendRequestsListUpdatesAutoChecking: startSendRequestsListUpdatesAutoCheckingAction,
      stopSendRequestsListUpdatesAutoChecking: stopSendRequestsListUpdatesAutoCheckingAction,
      performNewSearch: performNewSearchAction,
      deliverElement: deliverElementAction,
      resetDeliveryFailedFlag: () => ({ type: REVISION_OFFICE_MANAGER_ACTION_TYPE.RESET_FAILED_DELIVERY_FLAG }),
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
