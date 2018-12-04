import { TableFooter, TablePagination, TableSortLabel, Hidden } from '@material-ui/core';
import Schedule from '@material-ui/icons/Schedule';
import HighlightOff from '@material-ui/icons/HighlightOff';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import React, { Component } from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { COMMITS_ATTRIBUTE } from '../../constants/commits';
import { isWidthDown } from '@material-ui/core/withWidth';

const styles = {
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  }
};

const PLACEHOLDER_VALUE = '-';

/**
 * @class
 * This class is responsible of displaying a table
 * with specific commits data.
 */
class ProgrammerTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      sorting: {
        columnKey: null,
        direction: 'desc'
      }
    };

    this.renderTableToolbar = this.renderTableToolbar.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
    this.currentlyShowingColumnsCount = this.currentlyShowingColumnsCount.bind(this);
  }

  render() {
    const { classes, isLoading } = this.props;
    return (
      <Paper className={classes.paper}>
        {this.renderTableToolbar()}
        <Table>
          {this.renderTableHeader()}
          {isLoading ? this.renderTableSkeleton() : this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </Paper>
    );
  }

  renderTableToolbar() {
    const {
      tableToolbarTitle,
      latestUpdateTimestamp,
      tableData,
      onPageLoad,
      userRoleString,
      isLoading
    } = this.props;
    const { currentPage } = this.state;

    return (
      <Toolbar>
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={16}>
          <Grid item>
            <Typography variant="h5">{tableToolbarTitle}</Typography>
          </Grid>

          {/* Display badge when new updates have been found */}
          <Grid item>
            {!isLoading &&
              tableData.length > 0 &&
              tableData[currentPage] != null &&
              latestUpdateTimestamp > tableData[currentPage].updateTimestamp && (
                <Badge color="secondary">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onPageLoad(currentPage, userRoleString)}
                  >
                    Aggiornamenti disponibili
                    <RefreshIcon />
                  </Button>
                </Badge>
              )}
          </Grid>
        </Grid>
      </Toolbar>
    );
  }

  renderTableHeader() {
    const { tableColumns } = this.props;
    return (
      <TableHead>
        <TableRow>
          {tableColumns.map(column => (
            <Hidden key={column.key} smDown={!column.displayOnMobile}>
              <TableCell>
                <TableSortLabel
                  active={this.state.sorting.columnKey === column.key}
                  direction={this.state.sorting.direction}
                  onClick={() => {
                    const updatedSorting = {
                      columnKey: column.key,
                      direction: this.state.sorting.direction === 'asc' ? 'desc' : 'asc'
                    };
                    this.props.onPageLoad(this.state.currentPage, updatedSorting);
                    this.setState({ sorting: updatedSorting });
                  }}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            </Hidden>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  /**
   * Renders placeholder rows in the table while it's loading
   */
  renderTableSkeleton() {
    return (
      <TableBody>
        {React.Children.map(Array(LIST_ELEMENTS_PER_PAGE), () => {
          return (
            <TableRow>
              {React.Children.map(Array(this.currentlyShowingColumnsCount()), () => (
                <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  renderTableBody() {
    const { tableData, tableColumns } = this.props;
    return (
      <TableBody>
        {this.props.displayError ? (
          <TableRow>
            <TableCell>Impossibile ottenere i dati.</TableCell>
            {/* Render other empty cells to complete the row (otherwise the line would stop at the first cell) */}
            {React.Children.map(Array(this.currentlyShowingColumnsCount() - 1), () => (
              <TableCell />
            ))}
          </TableRow>
        ) : (
          tableData[this.state.currentPage].data.map(rowValue => {
            return (
              <TableRow hover key={rowValue.id}>
                {tableColumns.map(column => (
                  <Hidden key={rowValue[column.key]} smDown={!column.displayOnMobile}>
                    <TableCell padding="dense">
                      {this.renderCellContent(column.key, rowValue[column.key])}
                    </TableCell>
                  </Hidden>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    );
  }

  /**
   * Renders the content of a cell accordingly to its column
   * Needed for those columns which display icons or format values in some way
   */
  renderCellContent(columnKey, value) {
    switch (columnKey) {
      case COMMITS_ATTRIBUTE.AUTHOR:
        return value.name;
      case COMMITS_ATTRIBUTE.APPROVAL_STATUS:
        return this.renderApprovalStatusIcon(value);
      case COMMITS_ATTRIBUTE.TIMESTAMP:
        return new Date(value * 1000).toLocaleString('it-it');
      default:
        return value;
    }
  }

  renderApprovalStatusIcon(approvalStatus) {
    switch (approvalStatus) {
      case 1:
        return <CheckCircleOutline color="primary" />;
      case 0:
        return <Schedule color="action" />;
      case -1:
        return <HighlightOff color="error" />;
      default:
        return null;
    }
  }

  /**
   * Renders the table footer, which contains the pagination components
   */
  renderTableFooter() {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            count={this.props.itemsCount}
            rowsPerPage={LIST_ELEMENTS_PER_PAGE}
            page={this.state.currentPage}
            rowsPerPageOptions={[LIST_ELEMENTS_PER_PAGE]}
            onChangePage={(_, page) => {
              this.props.onPageLoad(page, this.state.sorting);
              this.setState({ currentPage: page });
            }}
          />
        </TableRow>
      </TableFooter>
    );
  }

  /**
   * Returns the count of the effectively shown columns depending on screen size
   */
  currentlyShowingColumnsCount() {
    let columnCount = 0;
    this.props.tableColumns.map(column => {
      if (isWidthDown('sm', this.props.width)) {
        if (column.displayOnMobile) columnCount++;
      } else columnCount++;
    });
    return columnCount;
  }
}

ProgrammerTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableToolbarTitle: PropTypes.string.isRequired,
  tableColumns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  onPageLoad: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latestUpdateTimestamp: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired
};

export default withWidth({ noSSR: true })(withStyles(styles)(ProgrammerTable));
