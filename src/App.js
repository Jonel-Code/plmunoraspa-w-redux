import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import swal from 'sweetalert';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import StudRequest from './comps/stud-request';
import AdminPortal from './comps/admin-portal';
import MainLogin from './comps/login/main-login';
import AdminLogin from './comps/login/admin-login';
import { auth_admin, auth_student } from './auth/basic-auth';

function PrivateRoute ({ redirect_to, component: Component, authed, ...rest }){
	console.log('authed', authed);
	console.log('redirect_to', redirect_to);
	return (
		<Route
			{...rest}
			render={(props) =>

					authed === true ? <Component authed={authed} {...props} /> :
					<Redirect to={{ pathname: redirect_to, state: { from: props.location } }} />}
		/>
	);
}

class App extends Component {
	show_swal = () => {
		swal({
			title : 'Swal test',
			text  : 'simple test usage of swal',
		});
	};

	componentDidMount () {
		console.log('this.state', this.state);
		console.log('this.props', this.props);
	}

	render () {
		console.log('this.props app.js', this.props);
		console.log('process.env.PLMUNORA_API', process.env);

		console.log('auth_admin()', auth_admin());

		return (
			<div className='App'>
				<Router>
					<Switch>
						<Route path='/login' exact component={MainLogin} />
						<Route path='/admin-login' exact component={AdminLogin} />
						<PrivateRoute
							redirect_to='/admin-login'
							authed={auth_admin()}
							path='/admin-dashboard'
							component={AdminPortal}
						/>
						<PrivateRoute
							redirect_to='/login'
							authed={auth_student()}
							path='/student-dashboard'
							component={StudRequest}
						/>
						<Redirect to='/login' />
					</Switch>
				</Router>
			</div>
		);
	}
}

function mapStateToProps (state){
	return {
		current_user : { ...state.userDataReducers.current_user },
	};
}

export default connect(mapStateToProps)(App);
