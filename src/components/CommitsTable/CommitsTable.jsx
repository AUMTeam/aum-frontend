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

const styles = {
  root: {
    flexGrow: 1,
    width: '100%'
  }
};

/**
 * @class
 * This class is responsible of displaying a table
 * with specific data.
 */
class CommitsTable extends Component {
  constructor(props) {
    super(props);

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
        </Table>
      </Paper>
    );
  }

  renderTableToolbar() {
    const { tableToolbarTitle } = this.props;
    return (
      <Toolbar>
        <Typography variant="h5">
          {tableToolbarTitle}
        </Typography>
      </Toolbar>
    );
  }

  renderTableHeader() {
    const { tableHeaderLabels } = this.props;
    return (
      <TableHead>
        <TableRow>
          {tableHeaderLabels.map(headerValue => (
            <TableCell>{headerValue}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  renderTableBody() {
    const { tableData } = this.props;
    return (
      <TableBody>
        {tableData.map(rowValue => {
          return (
            <TableRow>
              {rowValue.map(columnValue => (
                <TableCell>{columnValue}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }
}

CommitsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableToolbarTitle: PropTypes.string.isRequired,
  tableHeaderLabels: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired
};

export default withStyles(styles)(CommitsTable);
