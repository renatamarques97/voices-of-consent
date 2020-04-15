import React from "react";
import PropTypes from "prop-types";

const inputId = (name, optionType) => name + "_" + optionType;
const checked = (value, optionType) => value === optionType ? "checked" : "";

const RadioInput = (props) => {
  return (
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="radio"
        name={props.name}
        id={inputId(props.name, props.optionType)}
        onChange={props.onChange}
        checked={checked(props.value, props.optionType)} />
      <label className="form-check-label" htmlFor={props.name}>
        {props.label}
      </label>
    </div>
  );
}

RadioInput.propTypes = {
  name: PropTypes.string.isRequired,
  optionType: PropTypes.bool.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default RadioInput;
