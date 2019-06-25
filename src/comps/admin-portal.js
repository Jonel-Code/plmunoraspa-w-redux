import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment, Tab, Form, Dropdown, Container, Header, Button } from 'semantic-ui-react';
import './admin-portal.css';
import PlmunHeader from './header';

import { apiDocListFetch } from '../redux/actions/document-fetch';

const office_selection = [
	{
		key: 'registrar',
		text: 'Registrar',
		value: 'registrar',
	},
	{
		key: 'treasury',
		text: 'Treasury',
		value: 'treasury',
	},
];

const newAdminForm = (props = {}) => (
	<Form inverted>
		<Form.Group>
			<Form.Input label='Name' placeholder='Name' width={6} />
			<Form.Input label='Employee ID' placeholder='Employee ID' width={6} />
			<Form.Input label='Employee Email' placeholder='Email' width={8} />
		</Form.Group>
		<Form.Group>
			<Container>
				<Header as='h5' inverted>
					Select Office:
				</Header>
				<Dropdown placeholder='Select Office' fluid selection options={office_selection} />
			</Container>
		</Form.Group>
		<Button color='green' fluid>
			Create Account
		</Button>
	</Form>
);

class AdminPortal extends Component {
	get base_pane_style () {
		return { minHeight: '15em', backgroundColor: '#3e4553', border: '0px' };
	}

	get tab_content () {
		return [
			{
				menuItem: 'Student Request',
				render: () => <Tab.Pane style={this.base_pane_style}>Student Request</Tab.Pane>,
			},
			{
				menuItem: 'Add Document Request',
				render: () => <Tab.Pane style={this.base_pane_style}>Add Document Request</Tab.Pane>,
			},
			{
				menuItem: 'Update Document',
				render: () => <Tab.Pane style={this.base_pane_style}>Update Document</Tab.Pane>,
			},
			{
				menuItem: 'New Admin Account',
				render: () => {
					return <Tab.Pane style={this.base_pane_style}>{newAdminForm()}</Tab.Pane>;
				},
			},
		];
	}

	componentDidMount () {
		// apiDocListFetch();
	}
	componentWillMount () {
		console.log('componentWillMount');
		this.props.dispatch(apiDocListFetch());
	}

	reset_current_Set = () => {};

	render () {
		console.log('AdminPortal props', this.props);
		return (
			<Segment style={{ backgroundColor: 'transparent' }}>
				<PlmunHeader />
				<Tab
					style={{ marginTop: '1em' }}
					menu={{
						vertical: true,
						style: { backgroundColor: '#192736' },
						inverted: true,
						fluid: true,
						tabular: false,
						pointing: true,
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
		document_listing: [
			...state.userDataReducers.document_listing,
		],
		admin_data: { ...state.adminDataReducers.admin_data },
	};
}

export default connect(mapStateToProps)(AdminPortal);
