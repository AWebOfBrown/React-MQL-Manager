# 0.0.81 (December 6, 2017)

## MQLManager
* Set `queries` and `onChange` default arg to `null` to fix argument validation. 

# 0.0.8 (December 6, 2017)

## General
* Add a changelog. 

## Provider / withMediaQueries / MediaQueriesRenderProps 
* Provide initial match state to children of `wMQ` and `MWRP`.
    * Previously, the `<Provider>` component would not provide the initial match state of the user's `queries` (passed to the `<Provider>`). The `wMQ` and `MQRP` components only subscribe to updates in `componentDidMount`, as side-effects (and subscriptions) in the `constructor` [should be avoided](https://reactjs.org/docs/react-component.html#constructor). This is problematic if the user wishes to, for example, dynamically route (possibly with redirects) depending on the device width, which may result in undesireable redirects on first render.
    * To remedy this, the `<Provider>` now sets a second child `context` key: `mediaQueriesInitialState`, which `MQRP` and `wMQ` will provide to child components initially. 

* Better namespacing of context keys to avoid collisions.

## MQLManager 

* Add fourth named argument to `MQLManager` constructor fn:`parentMounted` which is a `Boolean`. If `parentMounted` is set to false, MQLManager will not attach a listener to its Media Query Lists until you call the `addListeners()` method, ideally from `componentDidMount`. Call `removeListeners()` from `componentWillUnmount` if the component hosting MQLManager unmounts.  

* Add `addListeners` and `removeListeners` methods as described above.

* Added an internal method to construct a mock MQL returning `true` as the `.matches` property for all queries, when `typeof window !== 'object'` (ie server-side rendering).    


## Tests
* Initial tests ensuring `queries` match state returns `true` when SSRing. 

## Documentation
* Updates reflecting the above changes. 
* Info on getting initial state from MQLManager when not using Provider. 
* Added troubleshooting.