import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form, Header, Image, Message, Ref } from 'semantic-ui-react';
import plmun_logo from '../../assets/plmun-logo.png';

function is_validty_valid (e){
	return e.target.validity.valid;
}

function toTitleCase (str){
	return str.replace(/\w\S*/g, function (txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

const MIN_NAME_LEN = 3;
const MIN_STUDENT_ID_LEN = 7;

class StudentDataCollector extends Component {
	constructor (
		props = {
			studentDataChanged: (e) => {},
			onNext: (e) => {},
		},
	) {
		super(props);
		this.props = props;

		this.state = {
			fields: {
				student_name: '',
				student_id: '',
			},
		};
		this.name_input = undefined;
		this.student_id_input = undefined;
	}

	handle_change_name = (e) => {
		if (is_validty_valid(e)) {
			this.change_name(e.target.value);
		}
	};

	change_name (new_name = '') {
		const old_fields = this.state.fields;
		old_fields.student_name = toTitleCase(new_name);
		this.setState({ fields: old_fields });
	}

	handle_change_student_id = (e) => {
		if (is_validty_valid(e)) {
			// const z = ''.Totl
			this.change_student_id(e.target.value);
		}
	};

	change_student_id (new_id = '') {
		const old_fields = this.state.fields;
		old_fields.student_id = new_id;
		this.setState({ fields: old_fields });
	}

	handle_on_next = (e) => {
		this.props.onNext(e);
	};

	componentDidUpdate () {
		this.props.studentDataChanged(JSON.parse(JSON.stringify(this.state.fields)));
	}

	required_fulfiled (not_test = false) {
		// always sucess on development environment
		if (!not_test && process.env.NODE_ENV === 'development') {
			return true;
		}
		if (!this.name_input || !this.student_id_input) {
			return false;
		}
		const { student_id, student_name } = this.state.fields;
		if (student_name.length >= MIN_NAME_LEN && student_id.length >= MIN_STUDENT_ID_LEN) {
			// console.log('completed');
			return true;
		}
		return false;
	}

	render () {
		const { student_id, student_name } = this.state.fields;
		return (
			<Fragment>
				<Card centered>
					<Card.Content textAlign='center'>
						<Header as='h2'>
							<Image src={plmun_logo} size='huge' circular />
							<br />
							Plmun Document Request Portal
						</Header>
					</Card.Content>
					<Card.Content textAlign='left'>
						<Form error={!this.required_fulfiled()} success={this.required_fulfiled()}>
							<Form.Field required>
								<label>Student Name</label>
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
										value={student_name}
										onChange={this.handle_change_name}
									/>
								</Ref>
							</Form.Field>
							<Form.Field required>
								<label>Student ID</label>
								<Ref
									innerRef={(e) => {
										this.student_id_input = e;
									}}>
									<Form.Input
										icon='id card outline'
										iconPosition='left'
										placeholder='Student ID'
										pattern='^[0-9]*'
										value={student_id}
										onChange={this.handle_change_student_id}
									/>
								</Ref>
							</Form.Field>
							<Button
								disabled={!this.required_fulfiled()}
								fluid
								primary
								type='submit'
								onClick={this.handle_on_next}>
								Next
							</Button>
							<Message
								error
								header='Required Information is Not Met'
								content='You can not Proceed on next Step Without Fulfilling the Required Fields'
							/>
							<Message
								success
								header='Required Information is Filled'
								content='You can now Select the Forms You want to request by Clicking the next Button'
							/>
						</Form>
					</Card.Content>
				</Card>
			</Fragment>
		);
	}
}

StudentDataCollector.propTypes = {
	studentDataChanged: PropTypes.func,
	onNext: PropTypes.func,
};

export default StudentDataCollector;
