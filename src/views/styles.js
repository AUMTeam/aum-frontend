/**
 * @file
 * This file holds JSS styles used in all views
 */

export const viewStyles = theme => ({
  grid: {
    margin: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: 16
    }
  },
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  }
});