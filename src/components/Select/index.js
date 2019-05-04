import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import React from 'react';

/**
 * @file
 * These components are used in selects powered by react-select inside dialogs to customize their appearance.
 */

const fontStyle = {
  fontFamily: 'Roboto',
  color: 'hsl(0,0%,20%)'
};

export function NoOptionsMessage(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

export function Control(props) {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

export function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

export function MultiValue(props) {
  console.log(props);

  return (
    <Chip
      className={props.selectProps.classes.chip}
      tabIndex={-1}
      label={props.data.label}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

export function Menu(props) {
  return (
    <Paper square style={fontStyle} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}
