/* eslint-disable array-callback-return */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import Table from '@material-ui/core/Table';
import Send from '@material-ui/icons/Send';
import PropTypes from 'prop-types';
import React from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { APPROVAL_STATUS, COMMON_ELEMENT_ATTRIBUTE, SEND_REQUEST_ATTRIBUTE } from '../../constants/elements';
import {
  getToBeDeliveredFilter,
  getSearchFilterOrDefault,
  getAlreadyDeliveredFilter,
  isSearchFilter
} from '../../utils/tableUtils';
import { renderElementFieldContent } from '../../utils/viewUtils';
import ApprovalStatusIcon from '../ApprovalStatusIcon';
import TableDynamicBody from '../Table/TableDynamicBody';
import TableSortableHeader from '../Table/TableSortableHeader';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableToolbar from '../Table/TableToolbar';
import withTableFunctionality from '../Table/WithTableFunctionality';

const DELIVER_BUTTON_COLUMN = 'DELIVER_BUTTON_COLUMN';

const alreadyDeliveredTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  {
    key: SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS,
    displayOnMobile: false,
    notSortable: true
  },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { key: SEND_REQUEST_ATTRIBUTE.DELIVERY_TIMESTAMP, displayOnMobile: true }
];

const toBeDeliveredTableColumns = [
  { key: COMMON_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { key: COMMON_ELEMENT_ATTRIBUTE.TITLE, displayOnMobile: true },
  { key: COMMON_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  {
    key: SEND_REQUEST_ATTRIBUTE.RECIPIENT_CLIENTS,
    displayOnMobile: false,
    notSortable: true
  },
  { key: COMMON_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  {
    label: 'Invia',
    key: DELIVER_BUTTON_COLUMN,
    displayOnMobile: true,
    notSortable: true
  }
];

class DeliveryTable extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isLoading !== nextProps.isLoading ||
      this.props.latestUpdateTimestamp !== nextProps.latestUpdateTimestamp ||
      this.props.successfullyDeliveredElements !== nextProps.successfullyDeliveredElements
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
    const deliverMode = this.isDeliveryMode();

    return (
      <>
        <TableToolbar
          toolbarTitle="Invio patch"
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[pageNumber] != null &&
            latestUpdateTimestamp > tableData[pageNumber].updateTimestamp
          }
          loadCurrentPage={loadCurrentPage}
          onSearchQueryChange={newQuery =>
            onFilterChange(getSearchFilterOrDefault(newQuery, getAlreadyDeliveredFilter()))
          }
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={deliverMode ? toBeDeliveredTableColumns : alreadyDeliveredTableColumns}
            sortingCriteria={sorting}
            onSortingUpdate={onSortingChange}
          />

          <TableDynamicBody
            tableColumns={deliverMode ? toBeDeliveredTableColumns : alreadyDeliveredTableColumns}
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
    const deliveryMode = this.isDeliveryMode();
    const isSearching = isSearchFilter(this.props.filter);
    return (
      <>
        <FormControlLabel
          disabled={isSearching}
          checked={!deliveryMode && !isSearching}
          control={<Radio color="primary" />}
          label="Già inviate"
          onChange={() => this.props.onFilterChange(getAlreadyDeliveredFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={deliveryMode && !isSearching}
          control={<Radio color="primary" />}
          label="Da inviare"
          onChange={() => this.props.onFilterChange(getToBeDeliveredFilter())}
        />
      </>
    );
  };

  renderCellContent = (columnKey, value, elementId) => {
    const { pageNumber, onElementDelivery, successfullyDeliveredElements } = this.props;

    switch (columnKey) {
      case DELIVER_BUTTON_COLUMN:
        return (
          <>
            {successfullyDeliveredElements.includes(elementId) ? (
              <ApprovalStatusIcon status={APPROVAL_STATUS.APPROVED} opacity={60} />
            ) : (
              <>
                <IconButton
                  onClick={event => {
                    onElementDelivery(elementId, pageNumber);
                    event.stopPropagation();
                  }}
                >
                  <Send color="action" />
                </IconButton>
              </>
            )}
          </>
        );
      default:
        return renderElementFieldContent(columnKey, value, elementId);
    }
  };

  isDeliveryMode = () => {
    return (
      this.props.filter.attribute === getToBeDeliveredFilter().attribute &&
      this.props.filter.valueMatches === getToBeDeliveredFilter().valueMatches
    );
  };
}

DeliveryTable.displayName = 'DeliveryTable';
DeliveryTable.propTypes = {
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  onElementDelivery: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  onElementClick: PropTypes.func.isRequired,
  successfullyDeliveredElements: PropTypes.array.isRequired,

  // injected by withTableFunctionality
  pageNumber: PropTypes.number.isRequired,
  sorting: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSortingChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default withTableFunctionality(DeliveryTable, getToBeDeliveredFilter());
