import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider, Segment, Header, Icon, Container, Button } from 'semantic-ui-react';
import FileSaver from 'file-saver';

import service from '../../services/base-service';
// import axios from 'axios';

class ViewPrintPdfForm extends Component {
	constructor (
		props = {
			onDownloadClick: () => {},
		},
	) {
		super(props);
		this.state = {};
	}

	download_pdf = () => {
		const { link } = this.props.pdf_data;
		const ex_url = link.split('/');
		const _x = ex_url.slice(-3).join('/');
		// console.log('_x', _x);

		service.getFileDlClient().get(_x, { responseType: 'blob' }).then((res) => {
			console.log('res', res);
			FileSaver.saveAs(res.data, 'Request-form.pdf');
		});
	};

	render () {
		const { onDownloadClick } = this.props;
		console.log('ViewPrintPdfForm props', this.props);
		const { link } = this.props.pdf_data;
		return (
			<Segment>
				<Divider horizontal>
					<Header as='h4'>
						<Icon name='file pdf outline' />
						Generated PDF
					</Header>
				</Divider>
				<iframe title='Request Form PDF' src={link} height='500px' width='100%' />
				<Divider horizontal>
					<Header as='h4'>
						<Icon name='download' />
						Download PDF
					</Header>
				</Divider>
				<Container>
					<Button
						onClick={() => {
							this.download_pdf();
							onDownloadClick();
						}}
						primary>
						<Icon name='download' />
						Download PDF
					</Button>
				</Container>
			</Segment>
		);
	}
}

function mapStateToProps (state){
	// console.log('state', state);
	return {
		pdf_data: { ...state.studentDataReducers.pdf_data },
	};
}
export default connect(mapStateToProps)(ViewPrintPdfForm);
