import React from 'react';
import API from '../api';

class Main extends React.Component<any, any>{

    componentDidMount(){
        API.fetchLinks();
    }

    render() {
        return (
            <div>
                <h3>Links</h3>
                <ul>
                    <li>Link...</li>
                    <li>Link...</li>
                </ul>
            </div>
        );
    }
}
