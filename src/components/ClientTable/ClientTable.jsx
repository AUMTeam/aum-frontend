/* eslint-disable array-callback-return */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import Table from '@material-ui/core/Table';
import FeedbackIcon from '@material-ui/icons/Feedback';
import GetAppIcon from '@material-ui/icons/GetApp';
import PropTypes from 'prop-types';
import React from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import {
  getAlreadyInstalledFilter,
  getSearchFilterOrDefault,
  getToBeInstalledFilter,
  isSearchFilter
} from '../../utils/tableUtils';
import { renderElementFieldContent } from '../../utils/viewUtils';
import TableDynamicBody from '../Table/TableDynamicBody';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableSortableHeader from '../Table/TableSortableHeader';
import TableToolbar from '../Table/TableToolbar';
import withTableFunctionality from '../Table/WithTableFunctionality';

const ACTIONS_COLUMN = 'ACTIONS_COLUMN';

const alreadyInstalledTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Referente interno', displayOnMobile: false },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE, displayOnMobile: false },
  { key: '' /* TODO */, label: 'Installazione riuscita', displayOnMobile: true }
];

const toBeInstalledTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.APPROVER, label: 'Referente interno', displayOnMobile: false },
  { key: SEND_REQUEST_ATTRIBUTE.INSTALL_TYPE, displayOnMobile: false },
  {
    label: 'Azioni',
    key: ACTIONS_COLUMN,
    displayOnMobile: true,
    notSortable: true,
    alignOption: 'center'
  }
];

class ClientTable extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isLoading !== nextProps.isLoading ||
      this.props.latestUpdateTimestamp !== nextProps.latestUpdateTimestamp
    );
  }

  render() {
    const {
      tableData,
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
    const showingUpdatesToBeInstalled = this.isShowingUpdatesToBeInstalled();

    return (
      <>
        <TableToolbar
          toolbarTitle="Download aggiornamenti"
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[pageNumber] != null &&
            latestUpdateTimestamp > tableData[pageNumber].updateTimestamp
          }
          loadCurrentPage={loadCurrentPage}
          onSearchQueryChange={newQuery =>
            onFilterChange(getSearchFilterOrDefault(newQuery, getAlreadyInstalledFilter()))
          }
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={showingUpdatesToBeInstalled ? toBeInstalledTableColumns : alreadyInstalledTableColumns}
            sortingCriteria={sorting}
            onSortingUpdate={onSortingChange}
          />

          <TableDynamicBody
            tableColumns={showingUpdatesToBeInstalled ? toBeInstalledTableColumns : alreadyInstalledTableColumns}
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
    const showingUpdatesToBeInstalled = this.isShowingUpdatesToBeInstalled();
    const isSearching = isSearchFilter(this.props.filter);
    return (
      <>
        <FormControlLabel
          disabled={isSearching}
          checked={!showingUpdatesToBeInstalled && !isSearching}
          control={<Radio color="primary" />}
          label="Già installati"
          onChange={() => this.props.onFilterChange(getAlreadyInstalledFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={showingUpdatesToBeInstalled && !isSearching}
          control={<Radio color="primary" />}
          label="Da installare"
          onChange={() => this.props.onFilterChange(getToBeInstalledFilter())}
        />
      </>
    );
  };

  renderCellContent = (columnKey, value, elementId) => {
    const { onElementDownload, onElementFeedback, pageNumber } = this.props;

    switch (columnKey) {
      case ACTIONS_COLUMN:
        return (
          <>
            <IconButton
              onClick={event => {
                onElementDownload(elementId, pageNumber);
                event.stopPropagation();
              }}
            >
              <GetAppIcon color="action" />
            </IconButton>
            <IconButton
              onClick={event => {
                onElementFeedback(elementId, pageNumber);
                event.stopPropagation();
              }}
            >
              <FeedbackIcon color="action" />
            </IconButton>
          </>
        );
      default:
        return renderElementFieldContent(columnKey, value);
    }
  };

  isShowingUpdatesToBeInstalled = () => {
    return (
      this.props.filter.attribute === getToBeInstalledFilter().attribute &&
      this.props.filter.valueMatches === getToBeInstalledFilter().valueMatches
    );
  };
}

ClientTable.displayName = 'ClientTable';
ClientTable.propTypes = {
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  onElementClick: PropTypes.func.isRequired,
  onElementDownload: PropTypes.func.isRequired,
  onElementFeedback: PropTypes.func.isRequired,

  // injected by withTableFunctionality
  pageNumber: PropTypes.number.isRequired,
  sorting: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSortingChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default withTableFunctionality(ClientTable, getToBeInstalledFilter());
