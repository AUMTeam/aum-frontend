/* eslint-disable array-callback-return */
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { LIST_ELEMENT_ATTRIBUTE } from '../../constants/listElements';
import { getSearchFilterOrDefault, renderCellContentCommon } from '../../utils/tableUtils';
import TableDynamicBody from '../Table/TableDynamicBody';
import TableSortableHeader from '../Table/TableSortableHeader';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableToolbar from '../Table/TableToolbar';
import withTableFunctionality from '../Table/WithTableFunctionality';

const tableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data creazione', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Data revisione', key: LIST_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, displayOnMobile: false },
  { label: 'Approvato', key: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
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
          onSearchQueryChange={newQuery => onFilterChange(getSearchFilterOrDefault(newQuery))}
        />
        <Table>
          <TableSortableHeader
            tableColumns={tableColumns}
            sortingCriteria={sorting}
            onSortingUpdate={onSortingChange}
          />

          <TableDynamicBody
            tableColumns={tableColumns}
            tableData={tableData}
            totalItemsCount={itemsCount}
            displayError={displayError}
            isLoading={isLoading}
            pageNumber={pageNumber}
            renderCellContent={renderCellContentCommon}
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

export default withTableFunctionality(ProgrammerTable);
