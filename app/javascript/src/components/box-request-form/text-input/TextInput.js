import React from "react";
import PropTypes from "prop-types";

const InputLabel = (props) => {
  const labelClass = props.position === "bottom" ? "row " : "";

  return (
    <label>
      <div className={labelClass + props.className}>
        {props.text}
      </div>
    </label>
  );
}

const TextInput = (props) => {
  return (
    <div className={props.containerClass}>
      <div className={ "row " + props.inputContainerClass }>
        {
          props.labelPosition === "top" &&
          <InputLabel
            className={props.labelContainerClass}
            text={props.label}
            position={props.labelPosition}
          />
        }
        <input
          type="text"
          className="form-control"
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
      {
        props.labelPosition === "bottom" &&
          <InputLabel
            className={props.labelContainerClass}
            text={props.label}
            position={props.labelPosition}
          />
      }
    </div>
  );
}

TextInput.propTypes = {
  containerClass: PropTypes.string.isRequired,
  inputContainerClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  labelContainerClass: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelPosition: PropTypes.string
};

TextInput.defaultProps = {
  labelPosition: "bottom"
};

export default TextInput;
