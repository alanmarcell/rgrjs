import { get } from 'jquery';
import ServerActions from './actions/ServerActions';

var API = {
    fetchLinks() {
        console.log('1. In API');


        get("/data/links").done(resp => {
            ServerActions.receiveLinks(resp);
        });
    }
};

export default API;