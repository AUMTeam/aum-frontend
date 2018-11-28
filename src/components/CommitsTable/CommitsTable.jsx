import { TableFooter, TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
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

const styles = {
  root: {
    flexGrow: 1,
    width: '100%'
  },
  progressContainer: {
    width: 'inherit',
    height: 'inherit'
  }
};

const PLACEHOLDER_VALUE = '-';

/**
 * @class
 * This class is responsible of displaying a table
 * with specific commits data.
 */
class CommitsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      dataSize: 0
    };

    this.renderTableToolbar = this.renderTableToolbar.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTableSkelethon = this.renderTableSkelethon.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
  }

  static getDerivedStateFromProps(nextProps, oldState) {
    if (nextProps.isLoading !== undefined && nextProps.isLoading) {
      console.log(nextProps.tableData);
      return {
        dataSize:
          nextProps.tableData[0] !== undefined
            ? nextProps.tableData[0].data.length // TODO: the logic doesn't work properly, rework needed
            : 0
      };
    }

    return null;
  }

  render() {
    const { classes, isLoading } = this.props;
    return (
      <Paper className={classes.root}>
        {this.renderTableToolbar()}
        <Table>
          {this.renderTableHeader()}
          {isLoading ? this.renderTableSkelethon() : this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </Paper>
    );
  }

  renderTableToolbar() {
    const { tableToolbarTitle, latestCommitTimestamp, tableData, onPageChange, userRoleString } = this.props;
    const { currentPage } = this.state;
    return (
      <Toolbar>
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={16}>
          <Grid item>
            <Typography variant="h5">{tableToolbarTitle}</Typography>
          </Grid>
          <Grid item>
            {tableData.length > 0 &&
              currentPage in tableData &&
              tableData[currentPage] != null &&
              latestCommitTimestamp > tableData[currentPage].updateTimestamp && (
                <Badge color="secondary">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onPageChange(currentPage, userRoleString)}
                  >
                    Nuovi commit disponibili
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
    const { tableHeaderLabels } = this.props;
    return (
      <TableHead>
        <TableRow>
          {tableHeaderLabels.map((headerValue, index) => (
            <TableCell key={index}>{headerValue}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  renderTableSkelethon() {
    const { dataSize } = this.state;
    return (
      <TableBody>
        {new Array(dataSize).fill().map((value, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              <TableCell>{PLACEHOLDER_VALUE}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  renderTableBody() {
    const { tableData } = this.props;
    return (
      <TableBody>
        {this.props.displayError ? (
          <TableRow>
            <TableCell>Impossibile ottenere i dati.</TableCell>
          </TableRow>
        ) : (
          tableData[this.state.currentPage].data.map((rowValue, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{rowValue.id}</TableCell>
                <TableCell>{rowValue.description}</TableCell>
                <TableCell>{new Date(rowValue.timestamp * 1000).toLocaleString('it-it')}</TableCell>
                <TableCell>{rowValue.author.username}</TableCell>
                <TableCell>{rowValue.approval_status}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    );
  }

  renderTableFooter() {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            count={this.props.itemsCount}
            rowsPerPage={LIST_ELEMENTS_PER_PAGE}
            page={this.state.currentPage}
            rowsPerPageOptions={[LIST_ELEMENTS_PER_PAGE]}
            onChangePage={(evt, page) => {
              this.props.onPageChange(page, this.props.userRoleString);
              this.setState({ currentPage: page });
            }}
          />
        </TableRow>
      </TableFooter>
    );
  }
}

CommitsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableToolbarTitle: PropTypes.string.isRequired,
  tableHeaderLabels: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  userRoleString: PropTypes.string.isRequired,
  displayError: PropTypes.bool.isRequired
};

export default withStyles(styles)(CommitsTable);
