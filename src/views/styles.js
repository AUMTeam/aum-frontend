/**
 * @file
 * This file holds JSS styles used in all views
 */

const programmerViewStyles = {
  fab: {
    right: 16,
    bottom: 16,
    position: 'fixed'
  }
}

export const viewStyles = theme => ({
  root: {
    width: '100%',
    paddingTop: 0,
    paddingBottom: 79,
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 16,
      paddingBottom: 79,
      paddingLeft: 16,
      paddingRight: 16
    }
  },
  paper: {
    flexGrow: 1,
    width: '100%',
    overflowX: 'auto'
  },
  ...programmerViewStyles
});
