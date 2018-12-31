import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = theme => ({
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


/**
 * Table toolbar contains title label, 'available updates' button (which appears when new updates are found)
 * and the search field.
 * Debouncing for search text input is handled by Saga.
 */
class TableToolbar extends React.PureComponent {
  render() {
    const {
      classes,
      toolbarTitle,
      showAvailableUpdatesBadge,
      loadCurrentPage,
      onSearchQueryChange,
      renderCustomContent
    } = this.props;

    return (
      <Toolbar>
        <Grid container direction="row" justify="space-between" alignItems="center" spacing={16}>
          <Grid item>
            <Typography variant="h5">{toolbarTitle}</Typography>
          </Grid>

          {/* Display badge when new updates have been found */}
          <Grid item>
            {showAvailableUpdatesBadge && (
              <Badge color="secondary">
                <Button variant="outlined" color="primary" onClick={loadCurrentPage}>
                  Aggiornamenti disponibili
                  <RefreshIcon />
                </Button>
              </Badge>
            )}
          </Grid>

          {/* Render custom supplied content inside a grid item */}
          {renderCustomContent != null && <Grid item>{renderCustomContent()}</Grid>}

          {/* Search bar */}
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
                onChange={event => onSearchQueryChange(event.target.value)}
              />
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    );
  }
}

TableToolbar.propTypes = {
  toolbarTitle: PropTypes.string.isRequired,
  showAvailableUpdatesBadge: PropTypes.bool.isRequired,
  loadCurrentPage: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  renderCustomContent: PropTypes.func
};

export default withStyles(toolbarStyles)(TableToolbar);
