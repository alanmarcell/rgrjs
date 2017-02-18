var React = require("react");
var ReactDOM = require("react-dom");

var Hello = React.createClass({
    render() {
        return React.createElement("h3", null, "Hello ES6!");
        // return <h3>     Hello Webpack ? </h3>

    }
});

ReactDOM.render(React.createElement(Hello), document.getElementById('react'));

// <Hello/>, document.getElementById('react'));