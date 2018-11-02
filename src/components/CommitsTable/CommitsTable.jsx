import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const styles = {};

/**
 * @class
 * This class is responsible of displaying a table 
 * with specific data.
 */
class CommitsTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tableHeaderLabels, tableData } = this.props;
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaderLabels.map(headerValue => (
                <TableCell>{headerValue}</TableCell>
              ))}
            </TableRow>
          </TableHead>
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
        </Table>
      </Paper>
    );
  }
}

CommitsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderLabels: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired
};

export default withStyles(styles)(CommitsTable);
