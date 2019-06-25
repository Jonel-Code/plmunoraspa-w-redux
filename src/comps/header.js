import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Header, Image, Container, Grid, Popup, Button, Divider, Icon } from 'semantic-ui-react';
import { USER_TYPE_ENUM } from '../redux/actions/index';

import plmun_logo from '../assets/plmun-logo.png';
import { toTitleCase } from './util/string-manipulation';

class PlmunHeader extends Component {
	constructor (
		props = {
			username: '',
			password: '',
		},
	) {
		super(props);
		this.props = props;
		this.state = {
			name: 'test',
			sid: 0,
		};
	}

	componentDidMount () {}

	componentWillReceiveProps () {
		// fetch user data on
		this.setState({});
	}

	logout = () => {
		localStorage.clear();
		window.location.reload();
	};

	popupUserDetail = () => {
		// const { name, sid } = this.state;
		const { id, name } = this.props.student_data;
		return (
			<Popup
				on='click'
				trigger={<Button circular icon='settings' color='blue' size='huge' />}
				style={{
					borderRadius: 0,
					opacity: 0.95,
					// padding: '2em',
				}}>
				<Popup.Content>
					<Divider horizontal>
						<Header as='h5'>
							<Icon name='user' />
							User Details
						</Header>
					</Divider>
					<Header as='h3'>
						Name: {toTitleCase(name)}
						<Header.Subheader>ID: {id}</Header.Subheader>
					</Header>
					<Route
						render={({ history }) => (
							<Button
								fluid
								color='grey'
								onClick={() => {
									this.logout();
									history.push('/');
								}}>
								Log out
							</Button>
						)}
					/>
				</Popup.Content>
			</Popup>
		);
	};

	render () {
		console.log(' this.props;', this.props);

		return (
			<Fragment>
				<Container fluid style={{ backgroundColor: '#193654' }}>
					<Grid padded centered verticalAlign='middle' divided columns={3}>
						<Grid.Column floated='left'>
							<Header as='h1' textAlign='left'>
								<Image src={plmun_logo} size='massive' circular />
								<Header.Content style={{ color: 'white' }}>
									PLMUN
									<Header.Subheader style={{ color: 'white' }}>
										Document Request Portal
									</Header.Subheader>
								</Header.Content>
							</Header>
						</Grid.Column>
						<Grid.Column floated='right'>
							<Container fluid textAlign='right'>
								{this.popupUserDetail()}
							</Container>
						</Grid.Column>
					</Grid>
				</Container>
			</Fragment>
		);
	}
}

function mapStateToProps (state){
	// console.log('state.userDataReducers.current_user.user_type', state.userDataReducers.current_user.user_type);
	if (state.userDataReducers.current_user.user_type === USER_TYPE_ENUM.admin) {
		return {
			student_data: { ...state.adminDataReducers.admin_data, id: state.adminDataReducers.admin_data.eid },
		};
	}
	return {
		student_data: { ...state.studentDataReducers.student_data },
	};
}

export default connect(mapStateToProps)(PlmunHeader);
