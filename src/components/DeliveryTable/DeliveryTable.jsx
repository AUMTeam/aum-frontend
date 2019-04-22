/* eslint-disable array-callback-return */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Send from '@material-ui/icons/Send';
import PropTypes from 'prop-types';
import React from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { APPROVAL_STATUS, LIST_ELEMENT_ATTRIBUTE } from '../../constants/listElements';
import {
  getToBeDeliveredFilter,
  getSearchFilterOrDefault,
  getAlreadyDeliveredFilter,
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
  }
};

const DELIVER_BUTTON_COLUMN = 'DELIVER_BUTTON_COLUMN';

const alreadyDeliveredTableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data creazione', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Destinatario/i', key: '' /* TODO */, displayOnMobile: false },
  { label: 'Richiedente', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Inviato il', key: '' /* TODO */, displayOnMobile: true }
];

const toBeDeliveredTableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data creazione', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Destinatario/i', key: '' /* TODO */, displayOnMobile: false },
  { label: 'Richiedente', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  {
    label: 'Invia',
    key: DELIVER_BUTTON_COLUMN,
    displayOnMobile: true,
    notSortable: true
  }
];

class DeliveryTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      sorting: getEmptySortingCriteria(),
      filter: getToBeDeliveredFilter() // TODO
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
      this.props.successfullyDeliveredElements !== nextProps.successfullyDeliveredElements
    );
  }

  render() {
    const {
      classes,
      tableData,
      itemsCount,
      isLoading,
      latestUpdateTimestamp,
      displayError,
      onElementClick
    } = this.props;
    const deliverMode = this.isDeliveryMode();

    return (
      <Paper className={classes.paper}>
        <TableToolbar
          toolbarTitle="Invio patch"
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[this.state.currentPage] != null &&
            latestUpdateTimestamp > tableData[this.state.currentPage].updateTimestamp
          }
          loadCurrentPage={this.loadCurrentPage}
          onSearchQueryChange={newQuery =>
            this.onFilterChange(getSearchFilterOrDefault(newQuery, getAlreadyDeliveredFilter()))
          }
          renderCustomContent={this.renderToolbarRadioButtons}
        />
        <Table>
          <TableSortableHeader
            tableColumns={deliverMode ? toBeDeliveredTableColumns : alreadyDeliveredTableColumns}
            sortingCriteria={this.state.sorting}
            onSortingUpdate={this.onSortingUpdate}
          />

          <TableDynamicBody
            tableColumns={deliverMode ? toBeDeliveredTableColumns : alreadyDeliveredTableColumns}
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
    const deliveryMode = this.isDeliveryMode();
    const isSearching = isSearchFilter(this.state.filter);
    return (
      <>
        <FormControlLabel
          disabled={isSearching}
          checked={!deliveryMode && !isSearching}
          control={<Radio color="primary" />}
          label="Già inviati"
          onChange={() => this.onFilterChange(getAlreadyDeliveredFilter())}
        />
        <FormControlLabel
          disabled={isSearching}
          checked={deliveryMode && !isSearching}
          control={<Radio color="primary" />}
          label="Da inviare"
          onChange={() => this.onFilterChange(getToBeDeliveredFilter())}
        />
      </>
    );
  };

  renderCellContent = (columnKey, value, elementId) => {
    const { onElementDelivery, successfullyDeliveredElements } = this.props;

    switch (columnKey) {
      case LIST_ELEMENT_ATTRIBUTE.AUTHOR:
        return value.name;
      case LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS:
        return <ApprovalStatusIcon status={+value} />;
      case LIST_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP:
      case LIST_ELEMENT_ATTRIBUTE.TIMESTAMP:
        return value ? new Date(value * 1000).toLocaleString('it-it') : '—';
      case DELIVER_BUTTON_COLUMN:
        return (
          <>
            {successfullyDeliveredElements.includes(elementId) ? (
              <ApprovalStatusIcon status={APPROVAL_STATUS.APPROVED} opacity={60} />
            ) : (
              <>
                <IconButton
                  onClick={event => {
                    onElementDelivery(elementId);
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
        return value;
    }
  };

  // Used to determine if review buttons should be displayed
  isDeliveryMode = () => {
    return (
      this.state.filter.attribute === getToBeDeliveredFilter().attribute &&
      this.state.filter.valueMatches === getToBeDeliveredFilter().valueMatches
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

  // prettier-ignore
  onFilterChange = newFilter => {
    this.setState({ filter: newFilter, currentPage: 0 });
    if (isSearchFilter(newFilter))
      this.props.onSearchQueryChange(newFilter.valueMatches);
    else
      this.props.loadPage(0, this.state.sorting, newFilter);
  };
}

DeliveryTable.displayName = 'DeliveryTable';
DeliveryTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  onElementDelivery: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  onElementClick: PropTypes.func.isRequired,
  successfullyDeliveredElements: PropTypes.array.isRequired
};

export default withStyles(tableStyles)(DeliveryTable);
