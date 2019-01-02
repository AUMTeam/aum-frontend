import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const PLACEHOLDER_VALUE = '—';

/**
 * @class
 * Placeholder table body used during data fetching from server.
 */
export default class TableBodySkeleton extends React.PureComponent {
  render() {
    const { columnsCount, itemsPerPage } = this.props;
    return (
      <TableBody>
        {React.Children.map(Array(itemsPerPage), () => {
          return (
            <TableRow>
              {React.Children.map(Array(columnsCount), () => (
                <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }
}

TableBodySkeleton.propTypes = {
  columnsCount: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired
};
