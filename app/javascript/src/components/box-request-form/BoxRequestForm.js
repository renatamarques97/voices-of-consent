import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

import TextInput from './text-input';
import FollowingQuestion from "./FollowingQuestion";

import './BoxRequestForm.scss';

class BoxRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      abuseTypeOptions: ["All of the Above"],
      attemptedSubmit: false,
      error: false,
      step: 0,
      boxRequest: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        street_address: '',
        city: '',
        state: '',
        zip: '',
        county: '',
        ok_to_email: null,
        ok_to_text: null,
        ok_to_call: null,
        ok_to_mail: null,
        question_re_affect: '',
        question_re_referral_source: '',
        question_re_current_situation: '',
        question_re_if_not_self_completed: '',
        is_safe: null,
        is_interested_in_counseling_services: null,
        is_interested_in_health_services: null,
        is_underage: null,
        abuse_types: [],
      },
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePaginatePrevious = this.handlePaginatePrevious.bind(this);
    this.handlePaginateForward = this.handlePaginateForward.bind(this);
  }

  componentDidMount() {
    const { abuseTypeOptions } = this.state;

    fetch('/abuse_types.json')
      .then(response => response.json())
      .then((data) => {
        const abuseTypes = data.map(({ name }) => name)

        this.setState({ abuseTypeOptions: [...abuseTypes, ...abuseTypeOptions] })
      });
  }

  handleChange(event) {
    this.setState({ boxRequest: { ...this.state.boxRequest, [event.target.name]: event.target.value} });
  }

  handleRadioChange(event) {
    let updatedChoice = event.target.id.includes("true") ? true : false;
    this.setState({ boxRequest: { ...this.state.boxRequest, [event.target.name]: updatedChoice} });
  }

  handleCheckBoxChange(event) {
    const abuseType = event.target.value;
    const { abuse_types } = this.state.boxRequest;
    let updatedTypes = [...abuse_types];

    if (abuseType === 'All of the Above') {
      if (updatedTypes.includes(abuseType)) {
        updatedTypes = [];
      }
      else {
        updatedTypes = this.state.abuseTypeOptions;
      }
    }
    else {
      if (updatedTypes.includes(abuseType)) {
        const index = updatedTypes.indexOf(abuseType);
        updatedTypes.splice(index, 1);
        if (updatedTypes.includes('All of the Above')) {
          const allIndex = updatedTypes.indexOf('All of the Above');
          updatedTypes.splice(allIndex, 1);
        }
      } else {
        updatedTypes.push(abuseType);
      }
    }

    this.setState({ boxRequest: { ...this.state.boxRequest, abuse_types: updatedTypes } });
  }

  handleSubmit(event) {
    this.setState({ attemptedSubmit: true, error: false })
    event.preventDefault();

    if (this.missingRequiredFields()) {
      console.log('Missing fields.')
      return;
    }

    const token = document.getElementsByName('csrf-token')[0].content;

    const { abuse_types } = this.state.boxRequest;
    if (abuse_types.includes('All of the Above')) {
      const allIndex = abuse_types.indexOf('All of the Above');
      abuse_types.splice(allIndex, 1);
      this.setState({ boxRequest: { ...this.state.boxRequest, abuse_types: abuse_types } });
    }

    window.fetch(location.origin + '/box_request_triage', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
       'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if(data.redirect_url) {
        window.location.href = data.redirect_url;
      }
      else {
        console.log(data.error)
        this.setState({ step: 0, error: true });
        return;
      }
    })
  }


  missingRequiredFields() {
    const {
      first_name,
      last_name,
      email,
      street_address,
      city,
      state,
      zip,
      ok_to_mail,
      ok_to_call,
      ok_to_text,
      ok_to_email,
      question_re_affect,
      question_re_referral_source,
      question_re_current_situation,
      is_safe,
      is_interested_in_counseling_services,
      is_interested_in_health_services,
      is_underage,
      abuse_types,
    } = this.state.boxRequest;

    const requiredFields = [first_name, last_name, email, street_address, city, state, zip, question_re_affect,
      question_re_referral_source, question_re_current_situation, is_safe, ok_to_mail, ok_to_call, ok_to_text,
      ok_to_email, is_interested_in_counseling_services, is_interested_in_health_services, is_underage];

    return requiredFields.includes(null) || requiredFields.includes('') || abuse_types.length === 0;
  }

  handlePaginatePrevious() {
    if (this.state.step > 0) {
      return this.setState({step: this.state.step - 1});
    }
  }

  handlePaginateForward() {
    if (this.state.step < 2) {
      return this.setState({step: this.state.step + 1});
    }
  }

  renderRequiredAlert() {
    return (
      <div className="row alert alert-danger required-field" role="alert">
        This field is required.
      </div>
    );
  }

  renderMissingFieldsAlert() {
    return (
      <div className="alert alert-danger required-fields-submit-alert" role="alert">
        Please fill out all the required fields.
      </div>
    );
  }

  renderValidEmailAlert() {
    return (
      <div className="alert alert-danger required-fields-submit-alert" role="alert">
        Please provide a valid email.
      </div>
    );
  }

  renderAbuseTypes() {
    const abuseTypes = this.state.abuseTypeOptions.map((type, index) =>
      <div className="row form-check" key={index}>
        <input className="form-check-input" type="checkbox" value={type} id={type} onChange={this.handleCheckBoxChange} checked={this.state.boxRequest.abuse_types.includes(type)} />
        <label className="form-check-label" htmlFor={type}>{type}</label>
      </div>
    );

    return abuseTypes;
  }

  renderTopSection() {
    const { boxRequest } = this.state;
    return (
      <div>
        <div className="row section-top section-label">Name*</div>
        { this.state.attemptedSubmit && (boxRequest.first_name == '' || boxRequest.last_name == '') ? this.renderRequiredAlert() : null }
        <div className="row">
          <div className="col-md">
            <input type="text" className="row form-control" name="first_name" value={boxRequest.first_name} onChange={this.handleChange} />
            <label className="row sub-text">First Name</label>
          </div>
          <div className="col-md">
            <input type="text" className="row form-control" name="last_name" value={boxRequest.last_name} onChange={this.handleChange} />
            <label className="row sub-text">Last Name</label>
          </div>
        </div>
        <div className="row section-top">
          <label className="section-label">Email Address*</label>
          <input type="text" className="form-control" name="email" value={boxRequest.email} onChange={this.handleChange} />
        </div>
        { this.state.attemptedSubmit && boxRequest.email == '' ? this.renderRequiredAlert() : null }
        { this.state.attemptedSubmit && this.state.error == true ? this.renderValidEmailAlert() : null }
        <div className="row">
          <FollowingQuestion
            question="Okay to email?"
            required={true}
            onChange={this.handleRadioChange}
            fieldName="ok_to_email"
            value={boxRequest.ok_to_email}
          />
        </div>
        { this.state.attemptedSubmit && boxRequest.ok_to_email == null ? this.renderRequiredAlert() : null }

        <label className="row section-top">Type(s) of abuse you have faced*</label>
        { this.state.attemptedSubmit && boxRequest.abuse_types.length === 0 ? this.renderRequiredAlert() : null }
        { this.renderAbuseTypes() }

        <div className="row section-top" >
          <label>Briefly describe your current situation. Is the abuse current? Do you live with your abuser? Do you have kids affected by the abuse?*</label>
          <textarea type="text" className="form-control" name="question_re_current_situation" value={boxRequest.question_re_current_situation} onChange={this.handleChange} />
        </div>
        { this.state.attemptedSubmit && boxRequest.question_re_current_situation == '' ? this.renderRequiredAlert() : null }

        <div className="row section-top">
          <label>How did this abuse affect your life?*</label>
          <textarea type="text" className="form-control" name="question_re_affect" value={boxRequest.question_re_affect} onChange={this.handleChange} />
        </div>
        { this.state.attemptedSubmit && boxRequest.question_re_affect == '' ? this.renderRequiredAlert() : null }
      </div>
    );
  }

  renderMiddleSection() {
    const { boxRequest } = this.state;
    return (
      <div>
        <FollowingQuestion
          question="Do you feel safe now?"
          required={true}
          onChange={this.handleRadioChange}
          fieldName="is_safe"
          value={boxRequest.is_safe}
          className="row section-top"
        >
          { this.state.attemptedSubmit && boxRequest.is_safe == null ? this.renderRequiredAlert() : null }
        </FollowingQuestion>

        <FollowingQuestion
          question="Are you interested in learning about free counseling services?"
          required={true}
          onChange={this.handleRadioChange}
          fieldName="is_interested_in_counseling_services"
          value={boxRequest.is_interested_in_counseling_services}
          className="row section-top"
        >
          { this.state.attemptedSubmit && boxRequest.is_interested_in_counseling_services == null ? this.renderRequiredAlert() : null }
        </FollowingQuestion>

        <FollowingQuestion
          question="Are you interested in learning about free health services?"
          required={true}
          onChange={this.handleRadioChange}
          fieldName="is_interested_in_health_services"
          value={boxRequest.is_interested_in_health_services}
          className="row section-top"
        >
          { this.state.attemptedSubmit && boxRequest.is_interested_in_health_services == null ? this.renderRequiredAlert() : null }
        </FollowingQuestion>

        <FollowingQuestion
          question="What is your age?"
          required={true}
          onChange={this.handleRadioChange}
          fieldName="is_underage"
          value={boxRequest.is_under_age}
          options={{ true: { label: "0-12 years old" }, false: { label: "13+ years old" } }}
          className="row section-top"
        >
          { this.state.attemptedSubmit && boxRequest.is_underage == null ? this.renderRequiredAlert() : null }
        </FollowingQuestion>

        <TextInput
          containerClass=""
          inputContainerClass="section-top"
          name="question_re_referral_source"
          value={boxRequest.question_re_referral_source}
          onChange={this.handleChange}
          label="How did you hear about us?*"
          labelPosition="top"
        />
        { this.state.attemptedSubmit && boxRequest.question_re_referral_source ? this.renderRequiredAlert() : null }
      </div>
    );
  }

  renderFinalSection() {
    const { boxRequest } = this.state;
    return (
      <div>
        <div className="row section-top section-label">Address*</div>
        { this.state.attemptedSubmit && (boxRequest.street_address === '' || boxRequest.city === '' || boxRequest.state === '' || boxRequest.zip === '') ? this.renderRequiredAlert() : null }
        <TextInput
          containerClass=""
          inputContainerClass="sub-text"
          name="street_address"
          value={boxRequest.street_address}
          onChange={this.handleChange}
          labelContainerClass="sub-text"
          label="Address 1"
        />
        <div className="row">
          <TextInput
            containerClass="col-9"
            inputContainerClass="sub-text"
            name="city"
            value={boxRequest.city}
            onChange={this.handleChange}
            labelContainerClass="sub-text"
            label="City"
          />
          <TextInput
            containerClass="col-3"
            inputContainerClass="sub-text"
            name="state"
            value={boxRequest.state}
            onChange={this.handleChange}
            labelContainerClass="sub-text"
            label="State"
          />
        </div>
        <div className="row">
          <TextInput
            containerClass="col-md"
            name="zip"
            value={boxRequest.zip}
            onChange={this.handleChange}
            labelContainerClass="sub-text"
            label="Zip Code"
          />
          <TextInput
            containerClass="col-md"
            name="county"
            value={boxRequest.county}
            onChange={this.handleChange}
            labelContainerClass="sub-text"
            label="County"
          />
        </div>
        <div className="row">
          <FollowingQuestion
            question="Okay to mail?"
            required={true}
            onChange={this.handleRadioChange}
            fieldName="ok_to_mail"
            value={boxRequest.ok_to_mail}
          />
        </div>
        { this.state.attemptedSubmit && boxRequest.ok_to_mail == null ? this.renderRequiredAlert() : null }

        <div className="row section-top">
          <label className="section-label">Phone</label>
          <input type="text" className="form-control" name="phone" value={boxRequest.phone} onChange={this.handleChange} />
          <div className="col-6">
            <div className="row">
              <FollowingQuestion
                question="Okay to call?"
                required={true}
                onChange={this.handleRadioChange}
                fieldName="ok_to_call"
                value={boxRequest.ok_to_call}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <FollowingQuestion
                question="Okay to text?"
                required={true}
                onChange={this.handleRadioChange}
                fieldName="ok_to_text"
                value={boxRequest.ok_to_text}
              />
            </div>
          </div>
        </div>

        { this.state.attemptedSubmit && boxRequest.phone != '' && (boxRequest.ok_to_text == null || boxRequest.ok_to_call == null) ? this.renderRequiredAlert() : null }

        <TextInput
          containerClass=""
          inputContainerClass="section-top"
          name="question_re_if_not_self_completed"
          value={boxRequest.question_re_if_not_self_completed}
          onChange={this.handleChange}
          label="Are you requesting this box for someone else? If so, please briefly explain."
          labelPosition="top"
        />
      </div>
    );
  }

  renderProgressBar() {
    const { first_name, last_name, email, street_address, city, state, zip, ok_to_mail, ok_to_call, ok_to_text, ok_to_email, question_re_affect,
      question_re_referral_source, question_re_current_situation, is_safe, is_interested_in_counseling_services, is_interested_in_health_services, is_underage, abuse_types } = this.state.boxRequest;

    const completedFields = [first_name, last_name, email, street_address, city, state, zip, question_re_affect,
      question_re_referral_source, question_re_current_situation, is_safe, ok_to_mail, ok_to_call, ok_to_text,
      ok_to_email, is_interested_in_counseling_services, is_interested_in_health_services, is_underage].filter(n => n === false || n);

    const percentageComplete = parseInt(completedFields.length / 17 * 100);

    return (
      <Progress percent={percentageComplete}  />
    );
  }

  renderPaginationAndProgressBar() {
    const currentStep = this.state.step;
    return (
      <div>
        <nav className="form-pagination row">
          <ul className="pagination">
            <li className={currentStep == 0 ? "page-item disabled" : "page-item"} onClick={this.handlePaginatePrevious}>
              <span className="page-link">Previous</span>
            </li>
            <li className={currentStep == 0 ? "page-item active" : "page-item"} onClick={() => this.setState({step: 0})}><a className="page-link">1</a></li>
            <li className={currentStep == 1 ? "page-item active" : "page-item"} onClick={() => this.setState({step: 1})}>
              <a className="page-link"> 2 </a>
            </li>
            <li className={currentStep == 2 ? "page-item active" : "page-item"} onClick={() => this.setState({step: 2})}><a className="page-link">3</a></li>
            <li className={currentStep == 2 ? "page-item disabled" : "page-item"} onClick={this.handlePaginateForward}>
              <span className="page-link">Next</span>
            </li>
          </ul>
        </nav>
      { this.renderProgressBar() }
      </div>
    );
  }

  render() {
    const { boxRequest } = this.state;

    return (
      <div className="outreach-form-container">
        <div className="form-info">If you are interested in receiving a survivor box, please fill out this quick form below.
          The more information you provide us with, the better we can help you.
          All information provided is 100% confidential and only seen by the leaders of our team.
          The return rate of our survivor boxes is 2-3 weeks due to high demand.
        </div>
        <form onSubmit={this.handleSubmit} style={{'borderTop': '2px dotted gray'}}>
          { this.state.step === 0 && this.renderTopSection() }
          { this.state.step === 1 && this.renderMiddleSection() }
          { this.state.step === 2 && this.renderFinalSection() }
          { this.renderPaginationAndProgressBar() }
          { this.state.attemptedSubmit && this.missingRequiredFields() ? this.renderMissingFieldsAlert() : null }
          <input type="submit" value="SUBMIT - SEND ME A SURVIVOR BOX" className={this.missingRequiredFields() ? "gray-submit" : null}/>
        </form>
      </div>
    );
  }
}

export default BoxRequestForm;
