import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Hidden from '@material-ui/core/Hidden';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const verticallyAlignedContentStyle = {
  display: 'flex',
  alignItems: 'center'
};

/**
 * @class
 * The body of the tables present in the different views. Data is rendered according to the given columns array,
 * which specifies the key to access data of the specific columns and whether they should be shown on mobile.
 * Columns are objects with the following shape: { label: string, key: string, displayOnMobile: bool }.
 * This component accepts also a function (renderCellContent) which defines how the values of the specific columns
 * must be rendered. Typically is a switch-case which always return a JSX snippet (in other words a component).
 */
export default class DynamicTableBody extends React.PureComponent {
  render() {
    const { tableData, tableColumns, displayError, totalItemsCount, pageNumber, renderCellContent } = this.props;
    return (
      <TableBody>
        {displayError ? (
          <TableRow>
            <TableCell colSpan={tableColumns.length}>
              <div style={verticallyAlignedContentStyle}>
                <ErrorOutline color="action" /> &ensp; Impossibile ottenere i dati.
              </div>
            </TableCell>
          </TableRow>
        ) : totalItemsCount === 0 ? (
          <TableRow>
            <TableCell colSpan={tableColumns.length}>Nessun dato presente.</TableCell>
          </TableRow>
        ) : (
          tableData[pageNumber].data.map(rowValue => {
            return (
              <TableRow hover key={rowValue.id}>
                {tableColumns.map(column => (
                  <Hidden key={rowValue[column.key]} smDown={!column.displayOnMobile}>
                    <TableCell padding="dense">{renderCellContent(column.key, rowValue[column.key])}</TableCell>
                  </Hidden>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    );
  }
}

DynamicTableBody.propTypes = {
  tableColumns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  pageNumber: PropTypes.number.isRequired,
  renderCellContent: PropTypes.func.isRequired
};