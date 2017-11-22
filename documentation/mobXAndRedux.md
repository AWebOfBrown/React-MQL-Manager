# Use with React and a State Management Library
When using a state management libary, you will only need to interact with the `MQLManager` component, usually
by instantiating it as a component class propery.

## MQLManager Constructor
The MQLManager constructor function accepts one required argument, being an object with the following properties:

| Property | Type | Required | Description |
|:---|:---|:---:|:---|
| queries | Object | ✓ | An object where the values must be valid css media query strings and the key names can be any string. Note that if you use the `<MediaQueriesRenderProps>` component (explained later), it's render method will use your queries' object keys as its arguments. |
| onChange | Function | ✓ | A function which fires when one of your media queries matches, or no longer matches. Use this to dispatch an action or trigger a setter, where the argument provided to the function is your queries object, with boolean values representing whether the query matches or not (see example below).|
| debounce | Number | x | An optional debounce number (of microseconds) applied to your onChange function. | 

# Examples
A typical example with Redux/MobX is illustrated below. Note that this assumes you have set up
your Mobx/Redux store, and are
farmiliar with the `<Provider />` used by Redux / MobX's React integrations and have 
rendered it somewhere (above) in the React component tree.

Also note: 
1. The codesandbox demo illustrates a full integration, store setup & all.
2. The implementations below are cleaner if you can use class properties via babel.

## Redux
```javascript
import React from "react"
import {MQLManager} from "react-mql-manager"
import {connect} from "react-redux"

class MyReduxConnectedClass extends React.Component {
  constructor(props) {
    super(props);
    this.MQLManager = new MQLManager({
      queries: {
        mobile: "(max-width: 480px)",
        tablet: "(min-width: 481px) and (max-width: 1079px)",
        desktop: "(min-width: 1080px)"
      },
      onChange: ({ mobile, tablet, desktop }) =>
        this.props.dispatch({
          type: "NEW_MEDIA_QUERY_MATCH",
          payload: { mediaQueries: { mobile, tablet, desktop } }
        }),
      debounce: 1000
    });
  }

  render() {
    return <SomeComponent />;
  }
}
// with no mapState / mapDispatchToProps, your class
// simply receives dispatch as a prop.
export default connect()(MyReduxConnectedClass);
```

## MobX
```javascript
import React from "react"
import {MQLManager} from "react-mql-manager"
import {inject} from "mobx-react"

class MyMobXConnectedClass extends React.Component {
  constructor(props) {
    super(props);
    this.MQLManager = new MQLManager({
      queries: {
        mobile: "(max-width: 480px)",
        tablet: "(min-width: 481px) and (max-width: 1079px)",
        desktop: "(min-width: 1080px)"
      },
      onChange: ({ mobile, tablet, desktop }) =>
        this.props.setMediaQueries({
          mobile,
          tablet,
          desktop
        }),
      debounce: 1000
    });
  }

  render() {
    return <SomeComponent />;
  }
}

export default inject(stores => ({
  setMediaQueries: stores.someStore.setMediaQueries
}))(MyMobXConnectedClass)

```