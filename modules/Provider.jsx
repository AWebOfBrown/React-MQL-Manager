import React, { Component } from "react";
import PropTypes from "prop-types";

import MQLManager from "./MQLManager";

class Provider extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.subscribe = this.subscribe.bind(this);
    this.MQLManager = new MQLManager({
      debounce: props.debounce,
      onChange: MQMatchState => this.broadcast(MQMatchState),
      queries: props.queries
    });
  }

  subscribe(updateHOCFunction) {
    // add subscription (this.setState() func from HOC) to list executed
    // when MQLs' match states change
    this.subscriptions.push(updateHOCFunction);
    // return unsubscribe function to be used in HOC's
    // componentWillUnmount() - stops Provider from
    // holding a reference to unmounted HOC preventing
    // garbage collection
    return () => {
      this.subscriptions = this.subscriptions.filter(
        updateFunc => updateFunc !== updateHOCFunction
      );
    };
  }

  broadcast(MQMatchState) {
    if (this.subscriptions.length) {
      return this.subscriptions.forEach(updateHOCFunction =>
        updateHOCFunction(MQMatchState)
      );
    }
  }

  getChildContext() {
    return {
      __React_MQL_Manager_Initial_State__: this.MQLManager.getMatchState(),
      __React_MQL_Manager_Subscription__: this.subscribe
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  __React_MQL_Manager_Initial_State__: PropTypes.objectOf(PropTypes.bool)
    .isRequired,
  __React_MQL_Manager_Subscription__: PropTypes.func.isRequired
};

Provider.propTypes = {
  queries: PropTypes.objectOf(PropTypes.string).isRequired,
  debounce: PropTypes.number
};

export default Provider;
