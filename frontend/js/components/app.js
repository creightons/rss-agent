import React, { Component } from 'react';
import ListItem from './list-item';
import { get } from '../utils';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = { rssData: [], error: null };
    }

    componentDidMount() {
        const self = this;
        get('/rss-urls')
            .then(({ data }) => self.setState({ rssData: data }))
            .catch(err => self.setState({ error: err }));
    }


    render() {
        let error;
        if (this.props.error) {
            error = (
                <div>Note: an error has occurred</div>
            );
        }

        return (
            <div>
                {error}
                <h2>RSS Links</h2>
                <ul>
                    {this.state.rssData.map(({ id, name }) => {
                        return ( <ListItem key={id} name={name} id={id} /> );
                    })}
                </ul>
            </div>
        );
    }
}
