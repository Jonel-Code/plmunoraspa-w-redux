import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Grid, Header, Container, Label, Icon } from 'semantic-ui-react';
import './request-select.css';
// import Slider from 'react-slick';

import { apiDocListFetch } from '../../redux/actions/document-fetch';
import { clear_req_form_data } from '../../redux/actions/request-form-submit';

const RequestCardGroup = (
	props = {
		available_request: [
			{ id: 0, abreviation: 't', desc: 'test', price: 0 },
		],
		onAddClick: (e) => {},
		onRemoveClick: (e) => {},
		added: [
			{ id: 0, abreviation: 't', desc: 'test', price: 0 },
		],
	},
) => {
	// console.log('props', props);
	const added_ids = props.added.map((x) => x.id);
	return (
		<Grid centered>
			<Grid.Row>
				<Grid.Column width={16}>
					<Card.Group centered>
						{props.available_request.map((x, i) => {
							return (
								<Card key={i}>
									<Card.Content>
										<Card.Header>{x.abreviation.toUpperCase()}</Card.Header>
										<Card.Meta>
											<Container textAlign='left'>ID: {x.id}</Container>
											<Label as='p' color='orange' ribbon='right'>
												Price: Php. {x.price}
											</Label>
										</Card.Meta>
										<Card.Description>{x.desc}</Card.Description>
									</Card.Content>
									<Card.Content extra>
										<div className='ui two buttons'>
											{
												!added_ids.includes(x.id) ? <Fragment>
													<Button
														basic
														color='green'
														onClick={() => {
															props.onAddClick(x);
														}}>
														Add
													</Button>
													<Button basic disabled color='red' onClick={() => {}}>
														Remove
													</Button>
												</Fragment> :
												<Fragment>
													<Button positive color='green'>
														Added
													</Button>
													<Button
														basic
														color='red'
														onClick={() => {
															props.onRemoveClick(x.id);
														}}>
														Remove
													</Button>
												</Fragment>}
										</div>
									</Card.Content>
								</Card>
							);
						})}
					</Card.Group>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

const selected_request_chips = (
	selected = [
		{ id: 0, abreviation: '' },
	],
	onRemoveClick = (e) => {},
) => (
	<Fragment>
		<Grid>
			<Grid.Column width={16}>
				<Label.Group>
					<Label as='span' size='large' key='lbl_selected' color='green' horizontal>
						Added Documents:
					</Label>
					{selected.map((x, i) => (
						<Label
							color='blue'
							tag
							key={i}
							as='h3'
							onClick={() => {
								onRemoveClick(x.id);
							}}>
							{x.abreviation}
							<Icon name='close' />
						</Label>
					))}
				</Label.Group>
			</Grid.Column>
		</Grid>
	</Fragment>
);

class RequestSelection extends Component {
	constructor (
		props = {
			available_request: [
				{ id: 0, abreviation: 'Tst', desc: 'test', price: 0 },
			],
			onNext: (e) => {},
			onBack: (e) => {},
		},
	) {
		super(props);
		this.props = props;

		this.state = {
			selected_request: [
				// { id: 0, abreviation: 'Tst', desc: 'test', price: 0 },
			],
		};
	}

	componentWillMount () {
		this.props.dispatch(clear_req_form_data());
		this.props.dispatch(apiDocListFetch());
	}

	remove_selected_request = (id = -1) => {
		const new_selected_request = this.state.selected_request;
		const _n = [];
		for (const item of new_selected_request) {
			if (item.id === id) {
				continue;
			}
			_n.push(item);
		}
		// new_selected_request.splice(index);
		this.setState({ selected_request: _n });
	};

	add_selected_request = (item = {}) => {
		const new_selected_request = this.state.selected_request;
		new_selected_request.push(JSON.parse(JSON.stringify(item)));
		this.setState({ selected_request: new_selected_request });
	};

	get total_price () {
		const { selected_request } = this.state;
		return get_total_price(selected_request.map((x) => x.price));
	}

	can_proceed () {
		const { selected_request } = this.state;
		return selected_request.length > 0;
	}

	render () {
		const { selected_request } = this.state;
		// console.log(' RequestSelection props', this.props);
		let { onNext, onBack, document_listing } = this.props;
		let available_request = [];
		if (Array.isArray(document_listing)) {
			available_request = document_listing.map((x) => {
				return {
					id: x.doc_id,
					desc: x.description,
					price: x.price,
					abreviation: x.title,
				};
			});
		}
		// console.log(' RequestSelection document_listing', document_listing);
		// console.log(' RequestSelection available_request', available_request);
		return (
			<Fragment>
				<div style={{ padding: '20px' }} className='ui stackable center aligned padded grid'>
					<Card centered fluid className='req-container'>
						<Card.Content textAlign='center'>
							<Header as='h2'>Select Documents to Request</Header>
						</Card.Content>
						<Card.Content>
							{selected_request_chips(
								selected_request.map((x, i) => {
									return {
										id: x.id,
										abreviation: x.abreviation,
									};
								}),
								(q) => {
									this.remove_selected_request(q);
								},
							)}
						</Card.Content>
						<Card.Content className='selection-container'>
							{RequestCardGroup({
								available_request: available_request,
								onAddClick: this.add_selected_request,
								onRemoveClick: this.remove_selected_request,
								added: selected_request,
							})}
						</Card.Content>

						<Card.Content extra>
							<Grid>
								<Grid.Column width={3}>
									<Container textAlign='left'>
										<Button
											negative
											onClick={(e) => {
												onBack(e);
											}}>
											Back
										</Button>
									</Container>
								</Grid.Column>
								<Grid.Column width={10}>
									<Container textAlign='right'>
										<Header as='h2'>
											<b>
												Total Price:{' '}
												{
													selected_request.length === 0 ? 0 :
													this.total_price}
											</b>
										</Header>
									</Container>
								</Grid.Column>
								<Grid.Column width={3}>
									<Container textAlign='right'>
										<Button
											disabled={!this.can_proceed()}
											primary
											onClick={(e) => {
												onNext(selected_request);
											}}>
											Next
										</Button>
									</Container>
								</Grid.Column>
							</Grid>
						</Card.Content>
					</Card>
				</div>
			</Fragment>
		);
	}
}

function get_total_price (arr = []){
	let total = 0;
	for (const item of arr) {
		total += item;
	}
	return total;
}
function mapStateToProps (state){
	// console.log('state', state);
	return {
		document_listing: [
			...state.userDataReducers.document_listing,
		],
	};
}

export default connect(mapStateToProps)(RequestSelection);
