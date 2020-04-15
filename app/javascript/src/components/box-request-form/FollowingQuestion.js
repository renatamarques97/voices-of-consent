import React from "react";
import PropTypes from "prop-types";

import RadioInput from "./radio-input";

const requiredLabel = value => value === true  ? "*" : "";

const truthyOption = {
  label: "Yes",
  value: true
};

const falseyOption = {
  label: "No",
  value: false
}

const defaultOptions = { true: truthyOption, false: falseyOption };

const FollowingQuestion = (props) => {
  const options = props.options || defaultOptions;

  return (
    <React.Fragment>
      <label className={ props.className }>
        {props.question}{requiredLabel(props.required)}
      </label>
      {props.children}
      <RadioInput
        name={props.fieldName}
        onChange={props.onChange}
        optionType={true}
        value={props.value}
        label={options[true].label}
      />
      <RadioInput
        name={props.fieldName}
        onChange={props.onChange}
        optionType={false}
        value={props.value}
        label={options[false].label}
      />
    </React.Fragment>
  );
};

FollowingQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  required: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  options: PropTypes.object,
  className: PropTypes.string,
};

FollowingQuestion.defaultProps = {
  className: "following-question",
};

export default FollowingQuestion;
