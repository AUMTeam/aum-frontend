import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LIST_ELEMENTS_PER_PAGE } from '../../../constants/api';

const styles = {
  handCursor: {
    cursor: 'pointer'
  },
  verticallyAlignedContent: {
    display: 'flex',
    alignItems: 'center'
  }
};

const disabledEntryRowStyle = {
  filter: 'opacity(0.65)'
};

const PLACEHOLDER_VALUE = '—';

/**
 * @class
 * The body of the tables present in the different views. Data is rendered according to the given columns array,
 * which specifies the key to access data of the specific columns and whether they should be shown on mobile.
 * Columns are objects with the following shape: { label: string, key: string, displayOnMobile: bool, alignOption?: string }.
 * This component accepts also a function (renderCellContent) which defines how the values of the specific columns
 * must be rendered. Typically is a switch-case which always return a JSX snippet (in other words a component).
 */
class TableDynamicBody extends React.Component {
  render() {
    const { tableColumns, displayError, totalItemsCount, isLoading } = this.props;

    return (
      <TableBody>
        {isLoading ? (
          this.renderSkeleton()
        ) : displayError ? (
          this.renderErrorMessageWithRetryButton()
        ) : totalItemsCount === 0 ? (
          <TableRow>
            <TableCell colSpan={tableColumns.length}>Nessun dato presente.</TableCell>
          </TableRow>
        ) : (
          this.renderContent()
        )}
      </TableBody>
    );
  }

  renderSkeleton = () => {
    return React.Children.map(Array(LIST_ELEMENTS_PER_PAGE), () => {
      return (
        <TableRow>
          {this.props.tableColumns.map((column, index) => (
            <Hidden key={index} smDown={!column.displayOnMobile}>
              <TableCell align={column.alignOption != null ? column.alignOption : undefined} padding="dense">
                {PLACEHOLDER_VALUE}
              </TableCell>
            </Hidden>
          ))}
        </TableRow>
      );
    });
  };

  renderErrorMessageWithRetryButton = () => {
    const { tableColumns, loadCurrentPage, classes } = this.props;
    return (
      <TableRow>
        <TableCell colSpan={tableColumns.length}>
          <div className={classes.verticallyAlignedContent}>
            <ErrorOutline color="action" /> &ensp; Impossibile ottenere i dati.&ensp;
            <Button size="small" onClick={loadCurrentPage} color="primary">
              Riprova
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  renderContent = () => {
    const {
      tableData,
      tableColumns,
      pageNumber,
      renderCellContent,
      onElementClick,
      disabledEntries,
      classes
    } = this.props;

    return tableData[pageNumber].data.map((element, rowIndex) => {
      const isEntryDisabled = disabledEntries.includes(element.id);
      const hasRowOnClickHandler = !isEntryDisabled && onElementClick != null;

      return (
        <TableRow
          className={hasRowOnClickHandler ? classes.handCursor : undefined}
          hover={hasRowOnClickHandler}
          onClick={hasRowOnClickHandler ? () => onElementClick(pageNumber, rowIndex, element.id) : undefined}
          key={element.id}
          style={isEntryDisabled ? disabledEntryRowStyle : undefined}
        >
          {tableColumns.map((column, columnIndex) => (
            <Hidden key={columnIndex} smDown={!column.displayOnMobile}>
              <TableCell align={column.alignOption || undefined} padding="dense">
                {renderCellContent(column.key, element[column.key], element.id)}
              </TableCell>
            </Hidden>
          ))}
        </TableRow>
      );
    });
  };
}

TableDynamicBody.displayName = 'TableDynamicBody';
TableDynamicBody.defaultProps = {
  disabledEntries: []
};
TableDynamicBody.propTypes = {
  tableColumns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
  displayError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pageNumber: PropTypes.number.isRequired,
  renderCellContent: PropTypes.func.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  disabledEntries: PropTypes.array,
  onElementClick: PropTypes.func
};

export default withStyles(styles)(TableDynamicBody);
