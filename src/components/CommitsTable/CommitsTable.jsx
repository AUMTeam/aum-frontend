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
import React, { Component } from 'react';
import { COMMITS_PER_PAGE } from '../../redux/actions/commits';
import { TableFooter, TablePagination, CircularProgress } from '@material-ui/core';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%'
  },
  spinner: {
    // TODO FIND A WAY TO CENTER THE SPINNER
    marginTop: '30px'
  }
};

/**
 * @class
 * This class is responsible of displaying a table
 * with specific commits data.
 */
class CommitsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0
    };

    this.renderTableToolbar = this.renderTableToolbar.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        {this.renderTableToolbar()}
        <Table>
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </Table>
      </Paper>
    );
  }

  renderTableToolbar() {
    const { tableToolbarTitle } = this.props;
    return (
      <Toolbar>
        <Typography variant="h5">{tableToolbarTitle}</Typography>
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

  renderTableBody() {
    const { tableData } = this.props;
    return (
      <TableBody>
        {/* TODO add error condition */}
        {this.props.isLoading ? (
          <CircularProgress style={styles.spinner} size={120} />
        ) : (
          tableData[this.state.currentPage].data.map((rowValue, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{rowValue.id}</TableCell>
                <TableCell>{rowValue.description}</TableCell>
                <TableCell>{new Date(rowValue.timestamp*1000).toLocaleString('it-it')}</TableCell>
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
            rowsPerPage={COMMITS_PER_PAGE}
            page={this.state.currentPage}
            rowsPerPageOptions={[COMMITS_PER_PAGE]}
            onChangePage={(evt, page) => {
              this.props.onPageChange(page, this.props.userRoleString);
              this.setState({currentPage: page});
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
  userRoleString: PropTypes.string.isRequired
};

export default withStyles(styles)(CommitsTable);
