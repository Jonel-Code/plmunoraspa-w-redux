import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Segment, Tab, Form, Dropdown, Container, Header, Button, Table, Popup } from 'semantic-ui-react';
import './admin-portal.css';
import PlmunHeader from './header';

import { apiDocListFetch } from '../redux/actions/document-fetch';

import { apiDeleteDocument, apiCreateDocument, apiUpdateDocument } from '../redux/actions/create-document';
import { apiCreateAdmin } from '../redux/actions/admin-actions';

const office_selection = [
	{
		key   : 'registrar',
		text  : 'Registrar',
		value : 'registrar',
	},
	{
		key   : 'treasury',
		text  : 'Treasury',
		value : 'treasury',
	},
];

class AdminPortal extends Component {
	constructor (props) {
		super(props);
		this.state = {
			documentForm : {
				title       : '',
				description : '',
				price       : '',
				documentId  : -1,
				isEdit      : false,
			},
			newAdminForm : {
				name       : '',
				employeeId : '',
				email      : '',
				office     : '',
			},
		};
	}

	get base_pane_style () {
		return { minHeight: '15em', backgroundColor: '#3e4553', border: '0px' };
	}

	get tab_content () {
		const { account_type } = this.props.admin_data;
		return [
			{
				menuItem : 'Student Requests',
				render   : () => <Tab.Pane style={this.base_pane_style}>{this.studentRequestsListing}</Tab.Pane>,
			},
			{
				menuItem : 'Available Documents',
				render   : () => <Tab.Pane style={this.base_pane_style}>{this.documentForm()}</Tab.Pane>,
			},


				account_type === 'admin' ? {
					menuItem : 'New Admin Account',
					render   : () => {
						return <Tab.Pane style={this.base_pane_style}>{this.newAdminForm()}</Tab.Pane>;
					},
				} :
				{},
		];
	}

	get studentRequestsListing () {
		return <Fragment>student request listing</Fragment>;
	}

	handleDocumentFormChange = (e, { name, value }) =>
		this.setState({ documentForm: { ...this.state.documentForm, [name]: value } });

	editDocument (documentId, title, description, price) {
		console.log('document id', documentId);
		this.setState({
			documentForm : {
				title       : title,
				description : description,
				price       : price,
				documentId  : documentId,
				isEdit      : true,
			},
		});
	}

	cancelEdit () {
		this.setState({
			documentForm : {
				title       : '',
				description : '',
				price       : '',
				documentId  : -1,
				isEdit      : false,
			},
		});
	}

	reloadDocumentListing () {
		this.props.dispatch(
			apiDocListFetch(() => {
				this.cancelEdit();
			}),
		);
	}

	deleteDocument (documentId) {
		// call update or add api call
		this.props.dispatch(
			apiDeleteDocument(documentId, () => {
				this.reloadDocumentListing();
			}),
		);
	}

	submitDocumentForm () {
		// call update or add api call
		const { documentId, title, description, price, isEdit } = this.state.documentForm;

		console.log('this.state.documentForm', this.state.documentForm);
		if (isEdit) {
			this.props.dispatch(
				apiUpdateDocument(documentId, title, description, price, () => {
					this.reloadDocumentListing();
				}),
			);
		}
		else {
			this.props.dispatch(
				apiCreateDocument(title, description, price, () => {
					this.reloadDocumentListing();
				}),
			);
		}
	}

	documentForm () {
		const { title, description, price, isEdit } = this.state.documentForm;
		return (
			<Fragment>
				<Form inverted>
					<Form.Group>
						<Form.Input
							value={title}
							name='title'
							onChange={this.handleDocumentFormChange}
							label='Title'
							placeholder='Title'
							width={4}
							required
						/>
						<Form.Input
							value={description}
							name='description'
							onChange={this.handleDocumentFormChange}
							label='Description'
							placeholder='Description'
							width={9}
							required
						/>
						<Form.Input
							value={price}
							name='price'
							onChange={this.handleDocumentFormChange}
							label='Price (Pesos)'
							type='number'
							placeholder='Price'
							width={4}
							required
						/>
					</Form.Group>
					<div className='document-form-buttons'>
						<Button
							type='submit'
							className='document-form-accept'
							color='green'
							fluid
							onClick={() => {
								this.submitDocumentForm();
							}}>
							{
								isEdit ? 'Update Document' :
								'Add Document'}
						</Button>
						<Button
							type='cancel'
							className='document-form-cancel'
							color='red'
							fluid
							onClick={() => {
								this.cancelEdit();
							}}>
							Cancel
						</Button>
					</div>
				</Form>
				{this.documentListing}
			</Fragment>
		);
	}

	get documentListing () {
		const documents = this.props.document_listing;
		return (
			<Fragment>
				<Table celled selectable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>ID</Table.HeaderCell>
							<Table.HeaderCell>Title</Table.HeaderCell>
							<Table.HeaderCell>Description</Table.HeaderCell>
							<Table.HeaderCell>Price</Table.HeaderCell>
							<Table.HeaderCell style={{ textAlign: 'center' }}>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{documents.map((doc, i) => (
							<Table.Row key={i}>
								<Table.Cell>{doc.doc_id}</Table.Cell>
								<Table.Cell>{doc.title}</Table.Cell>
								<Table.Cell>{doc.description}</Table.Cell>
								<Table.Cell>{doc.price}</Table.Cell>
								<Table.Cell style={{ textAlign: 'center' }}>
									<Popup
										content='Edit Document'
										trigger={
											<Button
												circular
												icon='pencil alternate'
												color='green'
												onClick={() => {
													this.editDocument(
														doc.doc_id,
														doc.title,
														doc.description,
														doc.price,
													);
												}}
											/>
										}
									/>{' '}
									<Popup
										content='Delete Document'
										trigger={
											<Button
												circular
												icon='trash alternate'
												color='red'
												onClick={() => {
													this.deleteDocument(doc.doc_id);
												}}
											/>
										}
									/>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</Fragment>
		);
	}

	handleNewAdminFormChange = (e, { name, value }) =>
		this.setState({ newAdminForm: { ...this.state.newAdminForm, [name]: value } });

	createAdminAccount () {
		const { name, employeeId, email, office } = this.state.newAdminForm;
		this.props.dispatch(apiCreateAdmin(name, employeeId, email, office));
	}
	newAdminForm () {
		const { name, employeeId, email, office } = this.state.newAdminForm;
		return (
			<Form inverted>
				<Form.Group>
					<Form.Input
						value={name}
						onChange={this.handleNewAdminFormChange}
						name='name'
						label='Name'
						placeholder='Name'
						width={7}
					/>
					<Form.Input
						value={employeeId}
						onChange={this.handleNewAdminFormChange}
						name='employeeId'
						label='Employee ID'
						placeholder='Employee ID'
						width={5}
					/>
					<Form.Input
						value={email}
						onChange={this.handleNewAdminFormChange}
						name='email'
						label='Employee Email'
						placeholder='Email'
						type='email'
						width={4}
					/>
				</Form.Group>
				<Form.Group>
					<Container>
						<Header as='h5' inverted>
							Select Office:
						</Header>
						<Dropdown
							value={office}
							onChange={this.handleNewAdminFormChange}
							name='office'
							placeholder='Select Office'
							fluid
							selection
							options={office_selection}
						/>
					</Container>
				</Form.Group>
				<Button
					color='green'
					fluid
					onClick={() => {
						this.createAdminAccount();
					}}>
					Create Account
				</Button>
			</Form>
		);
	}

	componentDidMount () {}

	componentWillMount () {
		console.log('componentWillMount');
		this.props.dispatch(apiDocListFetch());
		this.reset_current_Set();
	}

	reset_current_Set = () => {
		this.setState({
			documentForm : {
				title       : '',
				description : '',
				price       : '',
				documentId  : -1,
				isEdit      : false,
			},
			newAdminForm : {
				name       : '',
				employeeId : '',
				email      : '',
				office     : '',
			},
		});
	};

	render () {
		console.log('AdminPortal props', this.props);
		return (
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
		);
	}
}

function mapStateToProps (state){
	// console.log('state', state);
	return {
		document_listing : [
			...state.userDataReducers.document_listing,
		],
		admin_data       : { ...state.adminDataReducers.admin_data },
		admin_api_call   : { ...state.adminDataReducers.admin_api_call },
	};
}

export default connect(mapStateToProps)(AdminPortal);
