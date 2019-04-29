import Hidden from '@material-ui/core/Hidden';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React from 'react';
import { ATTRIBUTE_LABEL } from '../../../constants/elements';

/**
 * @class
 * Displays the header for the specified table columns, which can be clicked to trigger sorting.
 * A table column is described with an object that includes the key of the attribute, whether the
 * column should be displayed on mobile devices and optionally: a custom label in case default one
 * shouldn't be used, whether the column shouldn't be sortable and its alignment.
 */
export default class TableSortableHeader extends React.PureComponent {
  render() {
    const { tableColumns, sortingCriteria, onSortingUpdate } = this.props;
    return (
      <TableHead>
        <TableRow>
          {tableColumns.map(column => (
            <Hidden key={column.key} smDown={!column.displayOnMobile}>
              <TableCell align={column.alignOption != null ? column.alignOption : undefined} padding="dense">
                <TableSortLabel
                  active={sortingCriteria.columnKey === column.key}
                  direction={sortingCriteria.direction}
                  onClick={
                    column.notSortable
                      ? undefined
                      : () => {
                          const updatedSorting = {
                            columnKey: column.key,
                            direction: sortingCriteria.direction === 'asc' ? 'desc' : 'asc'
                          };
                          onSortingUpdate(updatedSorting);
                        }
                  }
                >
                  {column.label || ATTRIBUTE_LABEL[column.key]}
                </TableSortLabel>
              </TableCell>
            </Hidden>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

TableSortableHeader.displayName = 'TableSortableHeader';
TableSortableHeader.propTypes = {
  tableColumns: PropTypes.array.isRequired,
  sortingCriteria: PropTypes.object.isRequired,
  onSortingUpdate: PropTypes.func.isRequired
};
