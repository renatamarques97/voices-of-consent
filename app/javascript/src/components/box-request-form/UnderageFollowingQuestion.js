import React from "react";
import PropTypes from "prop-types";

import RadioInput from "./radio-input";

const requiredLabel = value => value === true  ? "*" : "";

const truthyOption = {
  label: "0-12 years old",
  value: true
};

const falseyOption = {
  label: "13+ years old",
  value: false
}

const defaultOptions = { true: truthyOption, false: falseyOption };

const UnderageFollowingQuestion = (props) => {
  const options = props.options || defaultOptions;

  // debugger;
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

UnderageFollowingQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  required: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  options: PropTypes.object,
  className: PropTypes.string,
};

UnderageFollowingQuestion.defaultProps = {
  className: "following-question",
};

export default UnderageFollowingQuestion;
