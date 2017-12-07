import React from "react";
import PropTypes from "prop-types";

class MediaQueriesRenderProps extends React.Component {
  constructor(props, context) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      mediaQueries: context.__React_MQL_Manager_Initial_State__()
    };
    if (props.children) {
      throw new Error(`MediaQueriesRenderProp expects a "render" method, instead of child elements, which is a function taking your media queries' keys
      as arguments, which can then be used by any elements returned from the function.`);
    }
  }

  componentDidMount() {
    this.unsubscribe = this.context[
      "__React_MQL_Manager_Subscription__"
    ](MQMatches => this.setState({ mediaQueries: MQMatches }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return this.props.render({ ...this.state.mediaQueries });
  }
}

MediaQueriesRenderProps.propTypes = {
  render: function(props, propName, compName) {
    if (typeof props[propName] !== "function") {
      `${compName} expects a "render" method, instead of child elements, which is a function taking your media queries' keys
      as arguments, which can then be used by any elements returned from the function.`;
    }
  }
};

MediaQueriesRenderProps.contextTypes = {
  __React_MQL_Manager_Subscription__: PropTypes.func.isRequired,
  __React_MQL_Manager_Initial_State__: PropTypes.func.isRequired
};

export default MediaQueriesRenderProps;
