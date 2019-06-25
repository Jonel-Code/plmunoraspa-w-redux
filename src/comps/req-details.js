import React, {Component} from 'react';
import {Button, Card, Header, Icon} from "semantic-ui-react";

class ReqDetails extends Component {
    render() {

        const {rid, sid, name, request_for} = this.props;

        return (
            <Card centered fluid>
                <Card.Content>
                    <Header as='h2'>
                        <Icon color='black' name='file outline'/>
                        Document Request #{rid} Details
                    </Header>
                </Card.Content>
                <Card.Content textAlign='left'>
                    <Header as='h4'>
                        Student ID: {sid} <br/>
                        Student Name: {name.toString().toUpperCase()} <br/>
                        Request for:
                    </Header>
                    <ol>
                        {request_for.map((x, i) => {
                            return (
                                <li key={i}>
                                    {x}
                                </li>
                            );
                        })}
                    </ol>

                </Card.Content>
                <Card.Content extra>
                    <Button negative={false} positive={true} disabled>
                        Paid
                    </Button>
                    <Button negative={true}>
                        Claimed
                    </Button>
                </Card.Content>
            </Card>
        );
    }
}

export default ReqDetails;