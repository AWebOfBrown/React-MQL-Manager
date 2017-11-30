import React from "react";
import PropTypes from "prop-types";

function withMediaQueries(WrappedComponent, mediaQueriesPropName) {
  if (mediaQueriesPropName && typeof mediaQueriesPropName !== "string") {
    throw new TypeError(`The second argument to withMediaQueries is an optional prop name (type: String)
    for the media queries prop received by your wrapped component, defaulting to "mediaQueries". Provided arg was not a string.`);
  }

  class WithMediaQueries extends React.Component {
    constructor(props, context) {
      super(props);
      this.unsubscribe = null;
      this.state = {
        mediaQueries: context.mediaQueriesInitialState
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
      const allProps = {
        ...this.props,
        [this.mediaQueriesPropName]: this.state.mediaQueries
      };
      return <WrappedComponent {...allProps} />;
    }
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }

  WithMediaQueries.displayName = `WithMediaQueries(${getDisplayName(
    WrappedComponent
  )})`;

  WithMediaQueries.contextTypes = {
    mediaQueriesSubscription: PropTypes.func.isRequired,
    mediaQueriesInitialState: PropTypes.objectOf(PropTypes.bool).isRequired
  };

  return WithMediaQueries;
}

export default withMediaQueries;
