import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Hidden from '@material-ui/core/Hidden';

export default class SortableTableHeader extends React.PureComponent {
  render() {
    const { tableColumns, sortingCriteria, onSortingUpdate } = this.props;
    return (
      <TableHead>
        <TableRow>
          {tableColumns.map(column => (
            <Hidden key={column.key} smDown={!column.displayOnMobile}>
              <TableCell>
                <TableSortLabel
                  active={sortingCriteria.columnKey === column.key}
                  direction={sortingCriteria.direction}
                  onClick={() => {
                    const updatedSorting = {
                      columnKey: column.key,
                      direction: sortingCriteria.direction === 'asc' ? 'desc' : 'asc'
                    };
                    onSortingUpdate(updatedSorting);
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
}

SortableTableHeader.propTypes = {
  tableColumns: PropTypes.array.isRequired,
  sortingCriteria: PropTypes.object.isRequired,
  onSortingUpdate: PropTypes.func.isRequired
};
