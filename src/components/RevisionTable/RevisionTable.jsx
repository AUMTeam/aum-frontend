/* eslint-disable array-callback-return */
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import RefreshIcon from '@material-ui/icons/Refresh';
import PropTypes from 'prop-types';
import React from 'react';
import { LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { APPROVAL_STATUS, LIST_ELEMENT_ATTRIBUTE } from '../../constants/listElements';
import { getHistoryFilter, getSearchFilter, getToBeReviewedFilter } from '../../utils/apiUtils';
import ApprovalStatusIcon from '../ApprovalStatusIcon';
import TableDynamicBody from '../Table/TableDynamicBody';
import TableSortableHeader from '../Table/TableSortableHeader';
import TableBodySkeleton from '../Table/TableBodySkeleton';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableToolbar from '../Table/TableToolbar';

const tableStyles = theme => ({
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  },
  approvedIcon: {
    color: theme.palette.approved
  },
  inactiveIcon: {
    filter: 'opacity(60%)'
  },
  errorSnackbar: {
    backgroundColor: theme.palette.error.main
  },
  errorBadge: {
    width: '16px',
    height: '16px'
  }
});

const REVIEW_BUTTONS_COLUMN = 'REVIEW_BUTTONS_COLUMN';

const historyTableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data creazione', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Data revisione', key: LIST_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, displayOnMobile: false },
  { label: 'Approvato', key: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

const reviewTableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data creazione', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  {
    label: 'Azioni',
    key: REVIEW_BUTTONS_COLUMN,
    displayOnMobile: true,
    notSortable: true,
    alignOption: 'center'
  }
];

/**
 * @class
 * Table which allows the user to show previously reviewed commits/send requests and to approve
 * or reject them.
 * Through radio buttons on the toolbar, the user can switch between the two functionalities. In
 * the code, the first is called "history mode", while the second "review mode".
 * Search functionality acts regardless of the selected mode (in fact, radio buttons are disabled during search).
 */
class RevisionTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      sorting: {
        columnKey: null,
        direction: 'desc'
      },
      filter: getToBeReviewedFilter(),

      reviewInProgressItems: [], // contains the ids of the items whose review is in progress
      /* The following objects are used as a map: the key is the element id,
         whereas the value is the approval flag chosen by user (approved (1) or rejected(-1)) */
      successfullyReviewedItems: {},
      failedReviewItems: {}
    };

    props.loadPage(0, this.state.sorting, this.state.filter);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isLoading !== nextProps.isLoading ||
      this.props.latestUpdateTimestamp !== nextProps.latestUpdateTimestamp ||
      this.state.reviewInProgressItems !== nextState.reviewInProgressItems ||
      this.state.successfullyReviewedItems !== nextState.successfullyReviewedItems ||
      this.state.failedReviewItems !== nextState.failedReviewItems
    );
  }

  render() {
    const { classes, tableData, elementType, itemsCount, isLoading, latestUpdateTimestamp, displayError } = this.props;
    const reviewMode = this.isReviewMode();

    return (
      <Paper className={classes.paper}>
        <TableToolbar
          toolbarTitle={
            elementType === LIST_ELEMENTS_TYPE.COMMITS ? 'Revisione commit' : 'Revisione richieste di invio'
          }
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[this.state.currentPage] != null &&
            latestUpdateTimestamp > tableData[this.state.currentPage].updateTimestamp
          }
          loadCurrentPage={this.loadCurrentPage}
          onSearchQueryChange={this.onSearchQueryChange}
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={reviewMode ? reviewTableColumns : historyTableColumns}
            sortingCriteria={this.state.sorting}
            onSortingUpdate={this.onSortingUpdate}
          />

          {isLoading ? (
            <TableBodySkeleton
              columnsCount={this.currentlyShowingColumnsCount(reviewMode)}
              itemsPerPage={LIST_ELEMENTS_PER_PAGE}
            />
          ) : (
            <TableDynamicBody
              tableColumns={reviewMode ? reviewTableColumns : historyTableColumns}
              tableData={tableData}
              totalItemsCount={itemsCount}
              displayError={displayError}
              pageNumber={this.state.currentPage}
              renderCellContent={this.renderCellContent}
            />
          )}

          <TablePaginationFooter
            itemsCount={itemsCount}
            itemsPerPage={LIST_ELEMENTS_PER_PAGE}
            currentPage={this.state.currentPage}
            onPageChange={this.onPageChange}
          />
        </Table>
      </Paper>
    );
  }

  renderToolbarRadioButtons = () => {
    const reviewMode = this.isReviewMode();
    const isSearching = this.isSearchingTerm();
    return (
      <>
        <FormControlLabel
          disabled={isSearching}
          checked={!reviewMode && !isSearching}
          control={<Radio color="primary" />}
          label="Già revisionati"
          onChange={() => this.onFilterChange(getHistoryFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={reviewMode && !isSearching}
          control={<Radio color="primary" />}
          label="Da revisionare"
          onChange={() => this.onFilterChange(getToBeReviewedFilter())}
        />
      </>
    );
  };

  renderCellContent = (columnKey, value, elementId) => {
    const { classes } = this.props;

    switch (columnKey) {
      case LIST_ELEMENT_ATTRIBUTE.AUTHOR:
        return value.name;
      case LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
        return <ApprovalStatusIcon status={+value} />;
      case LIST_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP:
      case LIST_ELEMENT_ATTRIBUTE.TIMESTAMP:
        if (!value)
          return '—';
        else
          return new Date(value * 1000).toLocaleString('it-it');
      case REVIEW_BUTTONS_COLUMN:
        return (
          <>
            {this.state.successfullyReviewedItems[elementId] != null ? (
              this.state.successfullyReviewedItems[elementId] === APPROVAL_STATUS.APPROVED ? (
                <CheckCircleOutline className={`${classes.approvedIcon} ${classes.inactiveIcon}`} />
              ) : (
                <HighlightOff className={classes.inactiveIcon} color="error" />
              )
            ) : this.state.failedReviewItems[elementId] != null ? (
              <IconButton onClick={() => this.onItemReviewRequest(elementId, this.state.failedReviewItems[elementId])}>
                <Badge classes={{ badge: classes.errorBadge }} badgeContent="!" color="error">
                  <RefreshIcon color="action" />
                </Badge>
              </IconButton>
            ) : this.state.reviewInProgressItems.includes(elementId) ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <IconButton onClick={() => this.onItemReviewRequest(elementId, APPROVAL_STATUS.REJECTED)}>
                  <HighlightOff color="error" />
                </IconButton>
                <IconButton onClick={() => this.onItemReviewRequest(elementId, APPROVAL_STATUS.APPROVED)}>
                  <CheckCircleOutline className={classes.approvedIcon} />
                </IconButton>
              </>
            )}
          </>
        );
      default:
        return value;
    }
  };

  // Used to determine if review buttons should be displayed
  isReviewMode = () => {
    return (
      this.state.filter.attribute === getToBeReviewedFilter().attribute &&
      this.state.filter.valueMatches === getToBeReviewedFilter().valueMatches
    );
  };

  // Used to determine if the search field is filled
  isSearchingTerm = () => {
    return this.state.filter.attribute === getSearchFilter('test').attribute;
  };

  // Returns the count of the effectively shown columns depending on screen size
  // prettier-ignore
  currentlyShowingColumnsCount = (reviewMode) => {
    const actualTableColumns = reviewMode ? reviewTableColumns : historyTableColumns;

    let columnCount = 0;
    actualTableColumns.map(column => {
      if (isWidthDown('sm', this.props.width)) {
        if (column.displayOnMobile)
          columnCount++;
      }
      else
        columnCount++;
    });
    return columnCount;    
  };

  loadCurrentPage = () => {
    this.props.loadPage(this.state.currentPage, this.state.sorting, this.state.filter);
  };

  onPageChange = nextPage => {
    this.setState({ currentPage: nextPage });
    this.props.loadPage(nextPage, this.state.sorting, this.state.filter);
  };

  onSortingUpdate = updatedSorting => {
    this.setState({ sorting: updatedSorting });
    this.props.loadPage(this.state.currentPage, updatedSorting, this.state.filter);
  };

  /**
   * Called when the user switches between "history" and "review" mode.
   * Success and failed (especially the latter) review items arrays are wiped because if we don't,
   * when a review request fails and the user selects "history" and then goes back to review mode,
   * error icon will be displayed again on the items whose review request failed
   */
  onFilterChange = newFilter => {
    this.setState({
      filter: newFilter,
      failedReviewItems: {},
      successfullyReviewedItems: {}
    });
    this.props.loadPage(0, this.state.sorting, newFilter);
  };

  /**
   * Called when review is requested for an item of the list
   * Updates state to show a spinner instead of buttons while API request is in progress
   */
  onItemReviewRequest = (elementId, approvalStatus) => {
    const failedReviewItemsUpdated = { ...this.state.failedReviewItems };
    // prettier-ignore
    if (this.state.failedReviewItems[elementId] != null)
      delete failedReviewItemsUpdated[elementId];

    const reviewInProgressItemsUpdated = [...this.state.reviewInProgressItems, elementId];
    this.setState({
      reviewInProgressItems: reviewInProgressItemsUpdated,
      failedReviewItems: failedReviewItemsUpdated
    });
    this.props.onItemReview(elementId, approvalStatus, this.onItemReviewCompleted);
  };

  /**
   * Callback passed to the function which performs the approval/rejection request
   * Updates state to display error or done icon instead of buttons
   */
  onItemReviewCompleted = (elementId, approvalStatus, success) => {
    const reviewInProgressItemsUpdated = [...this.state.reviewInProgressItems];
    reviewInProgressItemsUpdated.splice(reviewInProgressItemsUpdated.indexOf(elementId), 1);
    if (success) {
      const successfullyReviewedItemsUpdated = { ...this.state.successfullyReviewedItems };
      successfullyReviewedItemsUpdated[elementId] = approvalStatus;
      this.setState({
        reviewInProgressItems: reviewInProgressItemsUpdated,
        successfullyReviewedItems: successfullyReviewedItemsUpdated
      });
    } else {
      const failedReviewItemsUpdated = { ...this.state.failedReviewItems };
      failedReviewItemsUpdated[elementId] = approvalStatus;
      this.setState({
        reviewInProgressItems: reviewInProgressItemsUpdated,
        failedReviewItems: failedReviewItemsUpdated
      });
    }
  };

  onSearchQueryChange = newQuery => {
    if (newQuery !== '') {
      this.setState({ filter: getSearchFilter(newQuery) });
      this.props.onSearchQueryChange(newQuery);
    } else {
      this.onFilterChange(getHistoryFilter());
    }
  };
}

RevisionTable.displayName = 'RevisionTable';
RevisionTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  elementType: PropTypes.oneOf([LIST_ELEMENTS_TYPE.COMMITS, LIST_ELEMENTS_TYPE.SEND_REQUESTS]).isRequired,
  itemsCount: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  onItemReview: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired
};

export default withWidth({ noSSR: true })(withStyles(tableStyles)(RevisionTable));
