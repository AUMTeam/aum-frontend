import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CommitsTable from '../../components/CommitsTable/CommitsTable';

const COMMITS_TABLE_HEADER = ['ID', 'Descrizione', 'Data', 'Autore'];

const styles = {
  root: {
    flexGrow: 1,
    padding: 16
  }
};

/**
 * @class
 * This class is resposible of displaying the proper
 * components for the programmer view.
 */
class ProgrammerView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <CommitsTable
              tableToolbarTitle="Lista commit"
              tableHeaderLabels={COMMITS_TABLE_HEADER}
              tableData={[
                [
                  '3rns3dse',
                  'Improved search algorithm.',
                  '2018/08/09',
                  'Riccardo Busetti'
                ],
                [
                  '45efdfhsa',
                  'Fixed startup issues.',
                  '2018/08/01',
                  'Francesco Saltori'
                ]
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

ProgrammerView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProgrammerView);
