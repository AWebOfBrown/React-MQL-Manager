# Use with React and a State Management Library
When using a state management libary, you will only need to interact with the `MQLManager` component, usually
by instantiating it as a component class propery.

## MQLManager Constructor
The MQLManager constructor function accepts one required argument, being an object with the following properties:

| Property | Type | Required | Description |
|:---|:---|:---:|:---|
| queries | Object | ✓ | An object where the values must be valid css media query strings and the key names can be any string. |
| onChange | Function | ✓ | A function which fires when one of your media queries matches, or no longer matches. Use this to dispatch an action or trigger a setter, where the argument provided to the function is your queries object, with boolean values representing whether the queries match or not (see example below).|
| debounce | Number | x | An optional debounce number (of microseconds) applied to your onChange function. | 
| parentMounted | Boolean | x | Specify whether the component that you are instantiating MQLManager from has mounted (if applicable). Defaults to **true**. See further below. 

## MQLManager methods
| Method Name | Description |
|:---|:---|
| attachListeners | Used to attach listeners to the internal media query lists after the component has mounted, preventing a potential memory leak if async rendering is enabled. Call from `componentDidMount`. 
| detachListeners | If, for some reason, the component you are using `MQLManager` within unmounts (e.g. on route change), call this in `componentWillUnmount` to prevent memory leaks.
| getMatchState | Used to get the current match state of each query, returns an object whose keys are the names of your queries, values are Booleans. You most likely don't need this as your `onChange` function should handle changes, it is for initialising state when no state management lib is used.  

## Where to instantiate MQLManager

# Examples
A typical example with Redux/MobX is illustrated below. Note that this assumes you have set up
your Mobx/Redux store, and are
farmiliar with the `<Provider />` used by Redux / MobX's React integrations and have 
rendered it somewhere (above) in the React component tree.

Also note: 
1. The [codesandbox demo](https://codesandbox.io/s/p93xmm0zmm) illustrates a full integration, store setup & all.
2. The implementations below are cleaner if you can use class properties via babel.
3. You should INITIALISE media query state in your MobX or Redux store. For an example, see the CodeSandbox
demo. `MQLManager` cannot do this for you before first render because it would need to receive a props update in the constructor, where the action is dispatched. Reach out to me if this isn't clear, but follow the demo and you'll be fine :).  

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
      debounce: 1000,
      parentMounted: false
    });
  }

  componentDidMount(){
    this.MQLManager.attachListeners()
  }

  componentWillUnmount(){
    this.MQLManager.removeListeners()
  }

  render() {
    return this.props.children
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
      debounce: 1000,
      parentMounted: false
    });
  }

  componentDidMount(){
    this.MQLManager.attachListeners()
  }

  componentWillUnmount(){
    this.MQLManager.removeListeners()
  }

  render() {
    return this.props.children
  }
}

export default inject(stores => ({
  setMediaQueries: stores.someStore.setMediaQueries
}))(MyMobXConnectedClass)

```