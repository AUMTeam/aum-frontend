import { Hidden, TableFooter, TablePagination, TableSortLabel } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import RefreshIcon from '@material-ui/icons/Refresh';
import Schedule from '@material-ui/icons/Schedule';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LIST_ELEMENTS_PER_PAGE } from '../../constants/api';
import { COMMITS_ATTRIBUTE } from '../../constants/commits';

const styles = theme => ({
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: fade(theme.palette.common.black, 0.05),
    '&:hover': {
      borderColor: fade(theme.palette.common.black, 0.1)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 128,
      '&:focus': {
        width: 256
      }
    }
  }
});

const PLACEHOLDER_VALUE = '-';

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
      }
    };

    props.onPageLoad(0, this.state.sorting);

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
      classes,
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
          <Grid item>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Cerca..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
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
