/* eslint-disable array-callback-return */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { COMMON_ELEMENT_ATTRIBUTE } from '../../constants/elements';
import {
  getAlreadyReviewedFilter,
  getSearchFilterOrDefault,
  getToBeReviewedFilter,
  isSearchFilter
} from '../../utils/tableUtils';
import { renderElementFieldContent } from '../../utils/viewUtils';
import TableDynamicBody from '../Table/TableDynamicBody';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableSortableHeader from '../Table/TableSortableHeader';
import TableToolbar from '../Table/TableToolbar';
import withTableFunctionality from '../Table/WithTableFunctionality';

const toBeReviewedTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false }
];

const alreadyReviewedTableColumns = [
  ...toBeReviewedTableColumns,
  { key: COMMON_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

class ProgrammerTable extends Component {
  /**
   * Guarantees that the component is re-rendered only when its loading state changes
   * or when there are new updates (displays the badge)
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isLoading !== nextProps.isLoading ||
      this.props.latestUpdateTimestamp !== nextProps.latestUpdateTimestamp
    );
  }

  render() {
    const {
      isLoading,
      tableToolbarTitle,
      tableData,
      latestUpdateTimestamp,
      itemsCount,
      displayError,
      onElementClick,
      loadCurrentPage,
      onPageChange,
      onSortingChange,
      onFilterChange,
      pageNumber,
      sorting
    } = this.props;
    const isDisplayingNotReviewedItems = this.isDisplayingToBeReviewedItems();

    return (
      <>
        <TableToolbar
          toolbarTitle={tableToolbarTitle}
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[pageNumber] != null &&
            latestUpdateTimestamp > tableData[pageNumber].updateTimestamp
          }
          loadCurrentPage={loadCurrentPage}
          onSearchQueryChange={newQuery => onFilterChange(getSearchFilterOrDefault(newQuery, getToBeReviewedFilter()))}
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={isDisplayingNotReviewedItems ? toBeReviewedTableColumns : alreadyReviewedTableColumns}
            sortingCriteria={sorting}
            onSortingUpdate={onSortingChange}
          />

          <TableDynamicBody
            tableColumns={isDisplayingNotReviewedItems ? toBeReviewedTableColumns : alreadyReviewedTableColumns}
            tableData={tableData}
            totalItemsCount={itemsCount}
            displayError={displayError}
            isLoading={isLoading}
            pageNumber={pageNumber}
            renderCellContent={renderElementFieldContent}
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
    const isDisplayingNotReviewedItems = this.isDisplayingToBeReviewedItems();
    const isSearching = isSearchFilter(this.props.filter);
    return (
      <>
        <FormControlLabel
          disabled={isSearching}
          checked={!isDisplayingNotReviewedItems && !isSearching}
          control={<Radio color="primary" />}
          label="Già revisionati"
          onChange={() => this.props.onFilterChange(getAlreadyReviewedFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={isDisplayingNotReviewedItems && !isSearching}
          control={<Radio color="primary" />}
          label="In attesa di revisione"
          onChange={() => this.props.onFilterChange(getToBeReviewedFilter())}
        />
      </>
    );
  };

  // Used to determine if review buttons should be displayed
  isDisplayingToBeReviewedItems = () => {
    return (
      this.props.filter.attribute === getToBeReviewedFilter().attribute &&
      this.props.filter.valueMatches === getToBeReviewedFilter().valueMatches
    );
  };
}

ProgrammerTable.displayName = 'ProgrammerTable';
ProgrammerTable.propTypes = {
  tableToolbarTitle: PropTypes.string.isRequired,
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  onElementClick: PropTypes.func.isRequired,

  // injected by withTableFunctionality
  pageNumber: PropTypes.number.isRequired,
  sorting: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSortingChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default withTableFunctionality(ProgrammerTable, getToBeReviewedFilter());
