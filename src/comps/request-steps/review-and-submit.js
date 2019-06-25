import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Segment, Grid, Header, Icon, Table } from 'semantic-ui-react';
import { toTitleCase } from '../util/string-manipulation';

import { apiSubmitRequestForm } from '../../redux/actions/request-form-submit';

const DetailContainer = (title = '', content = <div />) => {
	return (
		<Grid columns={2} divided>
			<Grid.Row stretched>
				<Grid.Column width={5} floated='right'>
					<Header as='h3' textAlign='right'>
						{title.toUpperCase()}
					</Header>
				</Grid.Column>
				<Grid.Column width={11} floated='left'>
					{content}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

function get_total_price (arr = []){
	let total = 0;
	for (const item of arr) {
		total += item;
	}
	return total;
}

class ReviewAndSubmit extends Component {
	constructor (
		props = {
			name: '',
			sid: '',
			to_request: [
				{ id: 0, abreviation: 'Tst', desc: 'test', price: 0 },
			],
			onNext: (e) => {},
			onBack: (e) => {},
		},
	) {
		super(props);
		this.props = props;
		this.state = {
			form_submitting: false,
		};
	}

	info_render = () => {
		const { name, id } = this.props.student_data;
		return DetailContainer(
			'Basic Information',
			<Fragment>
				<Header as='h4' dividing>
					<Icon name='user' />
					<Header.Content>Student Name: {toTitleCase(name)}</Header.Content>
				</Header>
				<Header as='h4' dividing>
					<Icon name='id card outline' />
					<Header.Content>Student ID: {id}</Header.Content>
				</Header>
			</Fragment>,
		);
	};

	request_forms_render = () => {
		return DetailContainer('Documents to Request', this.forms_table());
	};

	forms_table = () => {
		// { id: 0, abreviation: 'Tst', desc: 'test', price: 0 },
		const { to_request } = this.props;
		return (
			<Table definition>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Title</Table.HeaderCell>
						<Table.HeaderCell>Description</Table.HeaderCell>
						<Table.HeaderCell>Price</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{to_request.map((x, i) => {
						return (
							<Table.Row key={i}>
								<Table.Cell>{x.abreviation}</Table.Cell>
								<Table.Cell>{x.desc}</Table.Cell>
								<Table.Cell>{x.price}</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell>Total</Table.HeaderCell>
						<Table.HeaderCell colSpan='3'>
							Php. {get_total_price(to_request.map((x) => x.price))}
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>
		);
	};

	fetch_form_pdf = () => {
		const { name, id } = this.props.student_data;
		const { to_request, onNext } = this.props;
		onNext();
		this.props.dispatch(apiSubmitRequestForm(name, id, to_request.map((x) => x.id)));
		// return process.env.REACT_APP_PLMUNORA_API + '/temp/9999/hl.pdf';
	};

	back_next_buttons = () => {
		const { onBack } = this.props;
		return (
			<Grid columns={3}>
				<Grid.Row>
					<Grid.Column textAlign='left' width={3}>
						<Button
							negative
							onClick={() => {
								onBack();
							}}>
							Back
						</Button>
					</Grid.Column>
					<Grid.Column width={9} />
					<Grid.Column textAlign='right' width={4}>
						<Button positive onClick={this.fetch_form_pdf}>
							Submit/Next
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	};

	render () {
		// console.log('ReviewAndSubmit props', this.props);
		return (
			<Fragment>
				<Segment>
					{this.info_render()}
					{this.request_forms_render()}
					{this.back_next_buttons()}
				</Segment>
			</Fragment>
		);
	}
}

function mapStateToProps (state){
	// console.log('state', state);
	return {
		student_data: { ...state.studentDataReducers.student_data },
	};
}
export default connect(mapStateToProps)(ReviewAndSubmit);
