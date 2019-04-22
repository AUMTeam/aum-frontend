/* eslint-disable array-callback-return */
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LIST_ELEMENTS_PER_PAGE, LIST_ELEMENTS_TYPE } from '../../constants/api';
import { LIST_ELEMENT_ATTRIBUTE } from '../../constants/listElements';
import { getSearchFilter } from '../../utils/apiUtils';
import ApprovalStatusIcon from '../ApprovalStatusIcon';
import TableDynamicBody from '../Table/TableDynamicBody';
import TableSortableHeader from '../Table/TableSortableHeader';
import TablePaginationFooter from '../Table/TablePaginationFooter';
import TableToolbar from '../Table/TableToolbar';

const styles = {
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  }
};

const tableColumns = [
  { label: 'ID', key: LIST_ELEMENT_ATTRIBUTE.ID, displayOnMobile: false },
  { label: 'Descrizione', key: LIST_ELEMENT_ATTRIBUTE.DESCRIPTION, displayOnMobile: true },
  { label: 'Data creazione', key: LIST_ELEMENT_ATTRIBUTE.TIMESTAMP, displayOnMobile: true },
  { label: 'Autore', key: LIST_ELEMENT_ATTRIBUTE.AUTHOR, displayOnMobile: false },
  { label: 'Data revisione', key: LIST_ELEMENT_ATTRIBUTE.UPDATE_TIMESTAMP, displayOnMobile: false },
  { label: 'Approvato', key: LIST_ELEMENT_ATTRIBUTE.APPROVAL_STATUS, displayOnMobile: true }
];

/**
 * @class
 * This class is responsible for displaying a responsive table
 * with generic data passed as props
 */
class ProgrammerTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      sorting: {
        columnKey: null,
        direction: 'desc'
      },
      filter: {}
    };
  }

  // Load the first page when table is created
  componentDidMount() {
    this.props.loadPage(0, this.state.sorting, this.state.filter);
  }

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
      classes,
      isLoading,
      tableToolbarTitle,
      tableData,
      latestUpdateTimestamp,
      itemsCount,
      displayError,
      onElementClick
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <TableToolbar
          toolbarTitle={tableToolbarTitle}
          showAvailableUpdatesBadge={
            !isLoading &&
            tableData.length > 0 &&
            tableData[this.state.currentPage] != null &&
            latestUpdateTimestamp > tableData[this.state.currentPage].updateTimestamp
          }
          loadCurrentPage={this.loadCurrentPage}
          onSearchQueryChange={this.onSearchQueryChange}
        />
        <Table>
          <TableSortableHeader
            tableColumns={tableColumns}
            sortingCriteria={this.state.sorting}
            onSortingUpdate={this.onSortingUpdate}
          />

          <TableDynamicBody
            tableColumns={tableColumns}
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

  /**
   * Renders the content of a cell accordingly to its column
   * Needed for those columns which display icons or format values in some way
   */
  // prettier-ignore
  renderCellContent(columnKey, value) {
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
      default:
        return value;
    }
  }

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

  loadCurrentPage = () => {
    this.props.loadPage(this.state.currentPage, this.state.sorting, this.state.filter);
  };
}

ProgrammerTable.displayName = 'ProgrammerTable';
ProgrammerTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableToolbarTitle: PropTypes.string.isRequired,
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  loadPage: PropTypes.func.isRequired,
  onSearchQueryChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  onElementClick: PropTypes.func.isRequired
};

export default withStyles(styles)(ProgrammerTable);
