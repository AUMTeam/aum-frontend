/* eslint-disable array-callback-return */
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import RefreshIcon from '@material-ui/icons/Refresh';
import PropTypes from 'prop-types';
import React from 'react';
import { LIST_ELEMENTS_PER_PAGE, ELEMENT_TYPE } from '../../constants/api';
import { APPROVAL_STATUS, COMMON_ELEMENT_ATTRIBUTE } from '../../constants/elements';
import {
  getAlreadyReviewedFilter,
  getSearchFilterOrDefault,
  getToBeReviewedFilter,
  isSearchFilter
} from '../../utils/tableUtils';
import { renderElementFieldContent } from '../../utils/viewUtils';
import StatusIcon from '../StatusIcon';
import TableDynamicBody from '../Table/TableDynamicBody';
import TableSortableHeader from '../Table/TableSortableHeader';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableToolbar from '../Table/TableToolbar';
import withTableFunctionality from '../Table/WithTableFunctionality';

const tableStyles = {
  errorBadge: {
    width: '16px',
    height: '16px'
  }
};

const REVIEW_BUTTONS_COLUMN = 'REVIEW_BUTTONS_COLUMN';

const historyTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

const reviewTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
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
      tableData,
      elementType,
      itemsCount,
      isLoading,
      latestUpdateTimestamp,
      displayError,
      onElementClick,
      loadCurrentPage,
      onPageChange,
      onSortingChange,
      onFilterChange,
      pageNumber,
      sorting
    } = this.props;
    const reviewMode = this.isReviewMode();

    return (
      <>
        <TableToolbar
          toolbarTitle={
            elementType === ELEMENT_TYPE.COMMITS ? 'Revisione commit' : 'Revisione richieste di invio'
          }
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[pageNumber] != null &&
            latestUpdateTimestamp > tableData[pageNumber].updateTimestamp
          }
          loadCurrentPage={loadCurrentPage}
          onSearchQueryChange={newQuery =>
            onFilterChange(getSearchFilterOrDefault(newQuery, getAlreadyReviewedFilter()))
          }
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={reviewMode ? reviewTableColumns : historyTableColumns}
            sortingCriteria={sorting}
            onSortingUpdate={onSortingChange}
          />

          <TableDynamicBody
            tableColumns={reviewMode ? reviewTableColumns : historyTableColumns}
            tableData={tableData}
            totalItemsCount={itemsCount}
            displayError={displayError}
            isLoading={isLoading}
            pageNumber={pageNumber}
            renderCellContent={this.renderCellContent}
            loadCurrentPage={loadCurrentPage}
            onElementClick={onElementClick}
          />

          <TablePaginationFooter
            itemsCount={itemsCount}
            itemsPerPage={LIST_ELEMENTS_PER_PAGE}
            currentPage={pageNumber}
            onPageChange={onPageChange}
          />
        </Table>
      </>
    );
  }

  renderToolbarRadioButtons = () => {
    const reviewMode = this.isReviewMode();
    const isSearching = isSearchFilter(this.props.filter);
    return (
      <>
        <FormControlLabel
          disabled={isSearching}
          checked={!reviewMode && !isSearching}
          control={<Radio color="primary" />}
          label="Già revisionati"
          onChange={() => this.props.onFilterChange(getAlreadyReviewedFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={reviewMode && !isSearching}
          control={<Radio color="primary" />}
          label="Da revisionare"
          onChange={() => this.props.onFilterChange(getToBeReviewedFilter())}
        />
      </>
    );
  };

  renderCellContent = (columnKey, value, elementId) => {
    const { classes, onItemReview, successfullyReviewedItems, reviewInProgressItems, failedReviewItems } = this.props;

    switch (columnKey) {
      case REVIEW_BUTTONS_COLUMN:
        return (
          <>
            {successfullyReviewedItems[elementId] != null ? (
              <StatusIcon status={successfullyReviewedItems[elementId]} opacity={60} />
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
                  <StatusIcon status={APPROVAL_STATUS.REJECTED} />
                </IconButton>
                <IconButton
                  onClick={event => {
                    onItemReview(elementId, APPROVAL_STATUS.APPROVED);
                    event.stopPropagation();
                  }}
                >
                  <StatusIcon status={APPROVAL_STATUS.APPROVED} />
                </IconButton>
              </>
            )}
          </>
        );
      default:
        return renderElementFieldContent(columnKey, value, elementId);
    }
  };

  // Used to determine if review buttons should be displayed
  isReviewMode = () => {
    return (
      this.props.filter.attribute === getToBeReviewedFilter().attribute &&
      this.props.filter.valueMatches === getToBeReviewedFilter().valueMatches
    );
  };
}

RevisionTable.displayName = 'RevisionTable';
RevisionTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  elementType: PropTypes.oneOf([ELEMENT_TYPE.COMMITS, ELEMENT_TYPE.SEND_REQUESTS]).isRequired,
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
  failedReviewItems: PropTypes.object.isRequired,

  // injected by withTableFunctionality
  pageNumber: PropTypes.number.isRequired,
  sorting: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSortingChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default withTableFunctionality(withStyles(tableStyles)(RevisionTable), getToBeReviewedFilter());
