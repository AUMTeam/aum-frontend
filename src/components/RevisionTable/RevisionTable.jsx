/* eslint-disable array-callback-return */
import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import SortableTableHeader from '../SortableTableHeader';
import TableToolbar from '../TableToolbar';
import TablePaginationFooter from '../TablePaginationFooter';
import TableBodySkeleton from '../TableBodySkeleton';
import DynamicTableBody from '../DynamicTableBody';
import ApprovalStatusIcon from '../ApprovalStatusIcon';
import { LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { LIST_ELEMENT_ATTRIBUTE, APPROVAL_STATUS } from '../../constants/listElements';
import { getSearchFilter, getHistoryFilter, getToBeReviewedFilter } from '../../utils/apiUtils';

const tableStyles = theme => ({
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  },
  approvedIcon: {
    color: theme.palette.approved
  }
});

const REVIEW_BUTTONS_COLUMN = 'REVIEW_BUTTONS_COLUMN';

const historyTableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Approvato', key: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

const reviewTableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Azioni', key: REVIEW_BUTTONS_COLUMN, displayOnMobile: true }
];

class RevisionTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      sorting: {
        columnKey: null,
        direction: 'desc'
      },
      filter: getToBeReviewedFilter()
    };

    props.loadPage(0, this.state.sorting, this.state.filter);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.isLoading !== nextProps.isLoading ||
      this.props.latestUpdateTimestamp !== nextProps.latestUpdateTimestamp
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
          <SortableTableHeader
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
            <DynamicTableBody
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
          checked={!reviewMode}
          control={<Radio />}
          label="Già revisionati"
          onChange={() => this.props.loadPage(0, this.state.sorting, getHistoryFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={reviewMode}
          control={<Radio />}
          label="Da revisionare"
          onChange={() => this.props.loadPage(0, this.state.sorting, getToBeReviewedFilter())}
        />
      </>
    );
  };

  renderCellContent = (columnKey, value, elementId) => {
    switch (columnKey) {
      case LIST_ELEMENT_ATTRIBUTE.AUTHOR:
        return value.name;
      case LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
        return <ApprovalStatusIcon status={+value} />;
      case LIST_ELEMENT_ATTRIBUTE.TIMESTAMP:
        return new Date(value * 1000).toLocaleString('it-it');
      case REVIEW_BUTTONS_COLUMN:
        return (
          <>
            <HighlightOff color="error" onClick={() => this.props.onItemReview(elementId, APPROVAL_STATUS.REJECTED)} />
            <CheckCircleOutline
              className={this.props.classes.approvedIcon}
              onClick={() => this.props.onItemReview(elementId, APPROVAL_STATUS.APPROVED)}
            />
          </>
        );
      default:
        return value;
    }
  }

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

  onSearchQueryChange = newQuery => {
    this.setState({ filter: getSearchFilter(newQuery) });
    this.props.onSearchQueryChanged(newQuery);
  };
}

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
