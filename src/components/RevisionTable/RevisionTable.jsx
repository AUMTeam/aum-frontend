/* eslint-disable array-callback-return */
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import RefreshIcon from '@material-ui/icons/Refresh';
import PropTypes from 'prop-types';
import React from 'react';
import { LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { APPROVAL_STATUS, LIST_ELEMENT_ATTRIBUTE } from '../../constants/listElements';
import {
  getHistoryFilter,
  getSearchFilterOrDefault,
  getToBeReviewedFilter,
  getEmptySortingCriteria,
  isSearchFilter
} from '../../utils/tableUtils';
import ApprovalStatusIcon from '../ApprovalStatusIcon';
import TableDynamicBody from '../Table/TableDynamicBody';
import TableSortableHeader from '../Table/TableSortableHeader';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableToolbar from '../Table/TableToolbar';

const tableStyles = {
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  },
  errorBadge: {
    width: '16px',
    height: '16px'
  }
};

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
      sorting: getEmptySortingCriteria(),
      filter: getToBeReviewedFilter()
    };
  }

  // Load the first page when table is created
  componentDidMount() {
    this.props.loadPage(0, this.state.sorting, this.state.filter);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.isLoading !== nextProps.isLoading ||
      this.props.latestUpdateTimestamp !== nextProps.latestUpdateTimestamp ||
      this.props.reviewInProgressItems !== nextProps.reviewInProgressItems ||
      this.props.successfullyReviewedItems !== nextProps.successfullyReviewedItems ||
      this.props.failedReviewItems !== nextProps.failedReviewItems
    );
  }

  render() {
    const {
      classes,
      tableData,
      elementType,
      itemsCount,
      isLoading,
      latestUpdateTimestamp,
      displayError,
      onElementClick
    } = this.props;
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
          onSearchQueryChange={newQuery =>
            this.onFilterChange(getSearchFilterOrDefault(newQuery, getHistoryFilter()))
          }
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={reviewMode ? reviewTableColumns : historyTableColumns}
            sortingCriteria={this.state.sorting}
            onSortingUpdate={this.onSortingUpdate}
          />

          <TableDynamicBody
            tableColumns={reviewMode ? reviewTableColumns : historyTableColumns}
            tableData={tableData}
            totalItemsCount={itemsCount}
            displayError={displayError}
            isLoading={isLoading}
            pageNumber={this.state.currentPage}
            renderCellContent={this.renderCellContent}
            loadCurrentPage={this.loadCurrentPage}
            onElementClick={onElementClick}
          />

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
    const isSearching = isSearchFilter(this.state.filter);
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
    const { classes, onItemReview, successfullyReviewedItems, reviewInProgressItems, failedReviewItems } = this.props;

    switch (columnKey) {
      case LIST_ELEMENT_ATTRIBUTE.AUTHOR:
        return value.name;
      case LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
        return <ApprovalStatusIcon status={+value} />;
      case LIST_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP:
      case LIST_ELEMENT_ATTRIBUTE.TIMESTAMP:
        return value ? new Date(value * 1000).toLocaleString('it-it') : '—';
      case REVIEW_BUTTONS_COLUMN:
        return (
          <>
            {successfullyReviewedItems[elementId] != null ? (
              <ApprovalStatusIcon status={successfullyReviewedItems[elementId]} opacity={60} />
            ) : failedReviewItems[elementId] != null ? (
              <IconButton
                onClick={event => {
                  onItemReview(elementId, this.props.failedReviewItems[elementId]);
                  event.stopPropagation();
                }}
              >
                <Badge classes={{ badge: classes.errorBadge }} badgeContent="!" color="error">
                  <RefreshIcon color="action" />
                </Badge>
              </IconButton>
            ) : reviewInProgressItems.includes(elementId) ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <IconButton
                  onClick={event => {
                    onItemReview(elementId, APPROVAL_STATUS.REJECTED);
                    event.stopPropagation();
                  }}
                >
                  <ApprovalStatusIcon status={APPROVAL_STATUS.REJECTED} />
                </IconButton>
                <IconButton
                  onClick={event => {
                    onItemReview(elementId, APPROVAL_STATUS.APPROVED);
                    event.stopPropagation();
                  }}
                >
                  <ApprovalStatusIcon status={APPROVAL_STATUS.APPROVED} />
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
  // prettier-ignore
  onFilterChange = newFilter => {
    this.setState({ filter: newFilter, currentPage: 0 });
    if (isSearchFilter(newFilter))
      this.props.onSearchQueryChange(newFilter.valueMatches);
    else
      this.props.loadPage(0, this.state.sorting, newFilter);
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
  displayError: PropTypes.bool.isRequired,
  onElementClick: PropTypes.func.isRequired,

  reviewInProgressItems: PropTypes.array.isRequired,
  successfullyReviewedItems: PropTypes.object.isRequired,
  failedReviewItems: PropTypes.object.isRequired
};

export default withStyles(tableStyles)(RevisionTable);
