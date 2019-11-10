import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Button, Card, Form, Header, Image, Ref, Message, Icon, Divider } from 'semantic-ui-react';
import plmun_logo from '../../assets/plmun-logo.png';

import { apiAuthenticateUser, authenticationClear } from '../../redux/actions/index';
import { apiRegisterNewUser } from '../../redux/actions/register-student';
import { toTitleCase } from '../util/string-manipulation';

function is_validty_valid (e){
  return e.target.validity.valid;
}

const LoginButton = (props = { disabled: false, onClick: () => {} }) => {
  const { disabled, onClick } = props;
  return (
    <Route
      render={({ history }) => (
        <Button
          disabled={disabled}
          fluid
          primary
          onClick={() => {
            onClick(history);
          }}>
          Login
        </Button>
      )}
    />
  );
};

const MIN_NAME_LEN = 3;
const MIN_STUDENT_ID_LEN = 3;

class MainLogin extends Component {
  constructor (props = {}) {
    super(props);
    this.props = props;

    this.state = {
      fields : {
        user_name : '',
        id_number : '',
        password  : '',
      },
    };
    this.name_input = undefined;
    this.id_number_input = undefined;
  }

  componentDidMount () {
    this.props.dispatch(authenticationClear());
  }

  handle_change_name = (e) => {
    if (is_validty_valid(e)) {
      this.change_name(e.target.value);
    }
  };

  change_name (new_name = '') {
    const old_fields = this.state.fields;
    old_fields.user_name = toTitleCase(new_name);
    this.setState({ fields: old_fields });
  }

  handle_change_student_id = (e) => {
    if (is_validty_valid(e)) {
      this.change_id_number(e.target.value);
    }
  };

  handle_change_password = (e) => {
    if (is_validty_valid(e)) {
      this.change_password(e.target.value);
    }
  };
  change_password (newPass = '') {
    const old_fields = this.state.fields;
    old_fields.password = newPass;
    this.setState({ fields: old_fields });
  }
  change_id_number (new_id = '') {
    const old_fields = this.state.fields;
    old_fields.id_number = new_id;
    this.setState({ fields: old_fields });
  }

  componentDidUpdate () {}

  required_fulfiled (not_test = false) {
    if (!this.name_input || !this.id_number_input || this.state.fields.password.length === 0) {
      return false;
    }
    const { id_number: student_id, user_name } = this.state.fields;
    if (user_name.length >= MIN_NAME_LEN && student_id.length >= MIN_STUDENT_ID_LEN) {
      return true;
    }
    return false;
  }

  clear_fields = () => {
    this.setState({
      fields : {
        user_name : '',
        id_number : '',
        password  : '',
      },
    });
  };

  render () {
    // console.log('props', this.props);
    const { id_number, user_name, password } = this.state.fields;
    const { login_failed } = this.props.current_user;
    console.log('!login_failed', !login_failed);
    return (
      <Fragment>
        <Card centered>
          <Card.Content textAlign='center'>
            <Header as='h2'>
              <Image src={plmun_logo} size='huge' circular />
              <br />
              Plmun Document Request Portal
              <Header.Subheader>Student Login</Header.Subheader>
            </Header>
          </Card.Content>
          <Card.Content textAlign='left'>
            <Form>
              <Form.Field required>
                <label>Name</label>
                <Ref
                  innerRef={(e) => {
                    this.name_input = e;
                  }}>
                  <Form.Input
                    icon='user'
                    iconPosition='left'
                    fluid
                    placeholder='Name'
                    pattern='^[a-zA-Z .]*'
                    value={user_name}
                    onChange={this.handle_change_name}
                  />
                </Ref>
              </Form.Field>
              <Form.Field required>
                <label>Student ID</label>
                <Ref
                  innerRef={(e) => {
                    this.id_number_input = e;
                  }}>
                  <Form.Input
                    icon='id card outline'
                    iconPosition='left'
                    placeholder='Student ID'
                    pattern='^[0-9]*'
                    value={id_number}
                    onChange={this.handle_change_student_id}
                  />
                </Ref>
              </Form.Field>
              <Form.Field required>
                <label>Password</label>
                <Ref
                  innerRef={(e) => {
                    this.id_number_input = e;
                  }}>
                  <Form.Input
                    type='password'
                    icon='user secret'
                    iconPosition='left'
                    placeholder='Password'
                    value={password}
                    onChange={this.handle_change_password}
                  />
                </Ref>
              </Form.Field>
              <LoginButton
                username={user_name}
                password={id_number}
                disabled={!this.required_fulfiled()}
                onClick={(history) => {
                  this.props.dispatch(
                    apiAuthenticateUser(
                      user_name,
                      id_number,
                      password,
                      () => {
                        history.push('/student-dashboard');
                      },
                      () => {
                        this.clear_fields();
                      },
                    ),
                  );
                }}
              />
              <Divider horizontal>
                <Header as='h6'>OR</Header>
              </Divider>
              <Button
                style={{ marginTop: '1em' }}
                size='mini'
                color='green'
                disabled={!this.required_fulfiled()}
                fluid
                onClick={() => {
                  this.props.dispatch(apiRegisterNewUser(user_name, id_number, password));
                }}>
                Register New Account
              </Button>
              <Message negative hidden={!login_failed}>
                <Icon name='warning sign' />
                <Message.Header>Authentication Failed</Message.Header>
                <p>Name or Student ID is incorrect</p>
              </Message>
            </Form>
          </Card.Content>
        </Card>
      </Fragment>
    );
  }
}

function mapStateToProps (state){
  // console.log('state', state);
  return {
    current_user : { ...state.userDataReducers.current_user },
  };
}

export default connect(mapStateToProps)(MainLogin);
