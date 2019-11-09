import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { Icon, Step, Container, Tab, Segment, Table, Header, Button, Popup } from 'semantic-ui-react';
import './stud-request.css';

import PlmunHeader from './header';

// import swal from 'sweetalert';

import RequestSelection from './request-steps/request-select';
import ReviewAndSubmit from './request-steps/review-and-submit';
import ViewPrintPdfForm from './request-steps/view-print-pdf-form';
// import plmun_logo from '../assets/plmun-logo.png';

import { fetchReqListing } from '../redux/actions/fetch-student-req-listing';
import { apiDeleteStudRequest } from '../redux/actions/delete-student-req';

const MAXSTEPS = 3;

class StudRequest extends Component {
  constructor () {
    super();
    this.student_name = '';
    this.student_id = '';
    this.state = {
      req_forms       : [],
      available_forms : [
        { id: 110, abreviation: 'cog', desc: 'Certificate of Grades', price: 30 },
        { id: 111, abreviation: 'tor', desc: 'Transcript Of Records', price: 250 },
        { id: 112, abreviation: 'com', desc: 'Certificate of Matriculation', price: 50 },
        { id: 113, abreviation: 'Honorable Dismissal', desc: 'Honorable Dismissal', price: 700 },
        { id: 114, abreviation: 'coe', desc: 'Certificate of Enrollment', price: 50 },
      ],
      current_step    : 0,
      pdf_link        : '',
    };
  }

  basic_data_updated = (e) => {
    this.student_name = e.student_name;
    this.student_id = e.student_id;
  };

  handle_next = (e) => {
    this.slider.slickNext();
  };

  handle_selection_next = (selected_forms) => {
    console.log('selected_forms', selected_forms);
    this.setState({ req_forms: selected_forms });
    this.handle_next();
  };

  handle_submit_next = () => {
    // this.setState({ pdf_link: pdf_link });
    // console.log('pdf_link', pdf_link);
    this.handle_next();
  };

  handle_download_click = () => {
    const { current_step } = this.state;
    this.setState({ current_step: current_step + 1 });
  };

  handle_back = (e) => {
    this.slider.slickPrev();
  };

  current_step_component = (step = -1) => {
    const { current_step } = this.state;
    return current_step === step;
  };

  update_current_step_slide = (next) => {
    this.setState({ current_step: next });
  };

  get slider_settings () {
    return {
      dots          : false,
      arrows        : false,
      accessibility : false,
      draggable     : false,
      infinite      : false,
      beforeChange  : (current, next) => {
        this.update_current_step_slide(next);
      },
    };
  }

  get basic_slider () {
    const { available_forms, pdf_link } = this.state;
    console.log('pdf_link', pdf_link);
    return (
      <Slider ref={(c) => (this.slider = c)} {...this.slider_settings}>
        {/* <StudentDataCollector studentDataChanged={this.basic_data_updated} onNext={this.handle_next} /> */}
        <RequestSelection
          available_request={available_forms}
          onNext={this.handle_selection_next}
          onBack={this.handle_back}
        />
        <ReviewAndSubmit {...this.request_form_data} />
        <ViewPrintPdfForm onDownloadClick={this.handle_download_click} />
      </Slider>
    );
  }

  get request_table () {
    const requests = this.props.student_data.requests;
    console.log('request_table requests', requests);
    return (
      <Fragment>
        <Header as='h2' textAlign='left' inverted>
          My Request
          <Header.Subheader />
        </Header>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Documents</Table.HeaderCell>
              <Table.HeaderCell>Date Requested</Table.HeaderCell>
              <Table.HeaderCell>Price (Pesos)</Table.HeaderCell>
              <Table.HeaderCell>OR Number</Table.HeaderCell>
              <Table.HeaderCell>Registrar Notes</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {requests.map((val, i) => (
              <Table.Row key={i}>
                <Table.Cell>{val.requestId}</Table.Cell>
                <Table.Cell>{val.description}</Table.Cell>
                <Table.Cell>{val.dateOfRequest}</Table.Cell>
                <Table.Cell>{val.total}</Table.Cell>
                <Table.Cell
                  negative={

                      !val.treasuryAccId ? true :
                      false
                  }
                  positive={

                      val.treasuryAccId ? true :
                      false
                  }>
                  {
                    !val.or_number || (typeof val.or_number == 'string' && val.or_number.length === 0) ? 'Unpaid' :
                    val.or_number}
                </Table.Cell>
                <Table.Cell
                  negative={

                      !val.registrarAccId ? true :
                      false
                  }
                  positive={

                      val.registrarAccId ? true :
                      false
                  }>
                  {
                    val.registrarAccId ? 'Claimed' :
                    'Unclaimed'}
                </Table.Cell>
                <Table.Cell>
                  <Popup
                    content={

                        val.registrarAccId || val.registrarAccId ? 'Cannot Delete Request' :
                        'Delete Request'
                    }
                    trigger={
                      <Button
                        negative
                        circular
                        icon='trash alternate'
                        disabled={val.registrarAccId}
                        onClick={() => {
                          this.deleteRequest(val.requestId);
                        }}
                      />
                    }
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>{requests.length} Requests</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell>{requests.filter((val) => val.registrarAccId).length} Paid</Table.HeaderCell>
              <Table.HeaderCell>{requests.filter((val) => val.registrarAccId).length} Claimed</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </Fragment>
    );
  }

  get request_form_data () {
    return {
      name       : this.student_name.trim(),
      sid        : this.student_id.trim(),
      to_request : this.state.req_forms,
      onNext     : this.handle_submit_next,
      onBack     : this.handle_back,
    };
  }

  get base_pane_style () {
    return { minHeight: '15em', backgroundColor: '#3e4553', border: '0px' };
  }

  get tab_content () {
    const { current_step } = this.state;
    return [
      {
        menuItem : 'My Document Requests',
        render   : () => <Tab.Pane style={this.base_pane_style}>{this.request_table}</Tab.Pane>,
      },
      {
        menuItem : 'New Document Request',
        render   : () => {
          return (
            <Tab.Pane style={this.base_pane_style}>
              <Container textAlign='center'>{StepProgress(current_step)}</Container>
              <Container style={{ marginTop: '1em' }}>{this.basic_slider}</Container>
            </Tab.Pane>
          );
        },
      },
    ];
  }

  componentDidMount () {
    this.fetchReqListing();
  }

  reset_current_Set = (e, data) => {
    this.setState({ current_step: 0 });
    if (data.activeIndex === 0) {
      this.fetchReqListing();
    }
  };

  fetchReqListing () {
    this.props.dispatch(fetchReqListing(this.props.student_data.id));
  }

  deleteRequest (reqId) {
    this.props.dispatch(
      apiDeleteStudRequest(reqId, () => {
        this.fetchReqListing();
      }),
    );
  }

  render () {
    console.log('stud - req props', this.props);
    // const { id, name } = this.props.student_data;
    return (
      <Fragment>
        <Segment style={{ backgroundColor: 'transparent' }}>
          <PlmunHeader />
          <Tab
            style={{ marginTop: '1em' }}
            menu={{
              vertical : true,
              style    : { backgroundColor: '#192736' },
              inverted : true,
              fluid    : true,
              tabular  : false,
              pointing : true,
            }}
            panes={this.tab_content}
            onTabChange={this.reset_current_Set}
          />
        </Segment>
      </Fragment>
    );
  }
}

const StepProgress = (current_step = 0, max_step = MAXSTEPS) => (
  <Step.Group attached='top' size='tiny' widths={max_step}>
    {/* <Step completed={current_step > 0} active={current_step <= 0}>
			<Icon name='user circle outline' />
			<Step.Content>
				<Step.Title>Basic Information</Step.Title>
				<Step.Description>Fill out Student Information</Step.Description>
			</Step.Content>
		</Step> */}
    <Step completed={current_step > 0} active={current_step <= 0}>
      <Icon name='wpforms' />
      <Step.Content>
        <Step.Title>Requested Documents</Step.Title>
        <Step.Description>Select Documents to Request</Step.Description>
      </Step.Content>
    </Step>
    <Step completed={current_step > 1} active={current_step <= 1}>
      <Icon name='send' />
      <Step.Content>
        <Step.Title>Review and Send Request</Step.Title>
        <Step.Description>Review then Submit Request Documents to the Registrar</Step.Description>
      </Step.Content>
    </Step>
    <Step completed={current_step > 2} active={current_step <= 2}>
      <Icon name='print' />
      <Step.Content>
        <Step.Title>Print Request Form</Step.Title>
        <Step.Description>Download/Print Request Documents Generated by the Server</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
);

function mapStateToProps (state){
  // console.log('state', state);
  return {
    student_data : { ...state.studentDataReducers.student_data },
  };
}

export default connect(mapStateToProps)(StudRequest);
