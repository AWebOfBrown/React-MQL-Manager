import React from "react";
import PropTypes from "prop-types";

function withMediaQueries(WrappedComponent, mediaQueriesPropName) {
  if (mediaQueriesPropName && typeof mediaQueriesPropName !== "string") {
    throw new TypeError(`The second argument to withMediaQueries is an optional prop name (type: String)
    for the media queries prop received by your wrapped component, defaulting to "mediaQueries". Provided arg was not a string.`);
  }

  class WithMediaQueries extends React.Component {
    constructor(props) {
      super(props);
      this.unsubscribe = null;
      this.state = {
        mediaQueries: {}
      };
      this.mediaQueriesPropName = mediaQueriesPropName || "mediaQueries";
    }

    componentDidMount() {
      this.unsubscribe = this.context.mediaQueriesSubscription(MQMatches => {
        this.setState({ mediaQueries: MQMatches });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      this.props = {
        ...this.props,
        [this.mediaQueriesPropName]: this.state.mediaQueries
      };
      return <WrappedComponent {...this.props} />;
    }
  }

  WithMediaQueries.contextTypes = {
    mediaQueriesSubscription: PropTypes.func.isRequired
  };

  return WithMediaQueries;
}

export default withMediaQueries;
