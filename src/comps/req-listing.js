import React, {Component} from 'react';
import {Card, Icon, Input, Popup} from "semantic-ui-react";
import './req-listing.css'


class ReqListing extends Component {

    state = {
        selected_item_id: false,
        req_items: [
            'COG',
            'TOR'
        ],
        show_list: [],
        request_list: [
            {
                id: '1121',
                req_date: '05-01-19',
                req_by: '16118081',
                req_name: 'jonel pante',
                req_content: [1, 2]
            },
            {
                id: '1129',
                req_date: '05-03-19',
                req_by: '16118083',
                req_name: 'pante',
                req_content: [1]
            },
            {
                id: '1122',
                req_date: '05-05-19',
                req_by: '16118086',
                req_name: 'jonel',
                req_content: [2]
            },
            {
                id: '1130',
                req_date: '05-05-19',
                req_by: '16118086',
                req_name: 'jonel',
                req_content: [0]
            }
        ]
    };

    componentDidMount() {
        this.set_initial_state();
    }

    set_initial_state() {
        const {request_list} = this.state;
        this.setState({
            show_list: request_list.slice(0, 5)
        });
    }

    render() {
        const {show_list} = this.state;
        return (

            <div className='card-size' >
                <div>
                    <Input
                        fluid
                        label={{content: 'Request #:', color: 'teal'}}
                        icon={<Icon color='teal' name='search' inverted circular link/>}
                        placeholder='Search Request ID'/>
                </div>
                <div className='search-results block-bg'>
                    <Card className='res-content'>
                        <Card.Group >
                            {show_list.map((v, i) => {
                                const CARDS = (
                                    <Card
                                        fluid
                                        className='noselect card-selection'
                                    >
                                        <Card.Content className='noselect card-selection'>
                                            <Card.Header>
                                                #{v.id}
                                            </Card.Header>
                                            <Card.Meta>
                                                Request Date: {v.req_date}
                                            </Card.Meta>
                                            <Card.Description>
                                                Student id: {v.req_by}
                                                <br/>
                                                Name: {v.req_name}
                                            </Card.Description>
                                        </Card.Content>
                                    </Card>
                                );
                                return (
                                    <Popup key={v.id} trigger={CARDS} position='right center'>
                                        <Popup.Header>Click to View Data</Popup.Header>
                                    </Popup>
                                );
                            })}
                        </Card.Group>
                    </Card>

                </div>
            </div>
        );
    }
}

export default ReqListing;