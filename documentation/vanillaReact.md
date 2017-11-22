# Vanilla React with No State Management Library

The recommended way to use React-MQL-Manager, without a state management library, is to utilise it's `<Provider>` in tandem
with either the `withMediaQueries` higher order component, or `MediaQueriesRenderProps` component. The implementation in your code is very simple, but behind-the-scenes these components essentially utilise the Context API for you. This avoids the need to use `this.setState({})` in a parent component, and then pass down that state as props to every single child component (and possibly intermedies) that need to know which media queries are matching / not matching the current viewport/window/device etc. For those curious about how this all works, see further [How to safely use React Context - Michel Westrate](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076).

Below we will explore using the `<Provider>` as described, however, it should be noted that it is also possible to use the more traditional (and tedious) method of `this.setState({})`, by consuming `MQLManager` as described in the [integration with a state library docs](https://github.com/AWebOfBrown/React-MQL-Manager/blob/master/documentation/mobXAndRedux.md). Rather than plugging in a Redux / MobX action, one would use `this.setState({})` as MQLManager's onChange argument, and pass down the media queries state as props to lower components. Also note that if you use setState as the onChange value, instantiate the class in componentDidMount as setState cannot be called on a mounting component.

With that said, let's explore the API / guide to easily consuming React-MQL-Manager:

## Examples Using the Provider
Import the Provider component and render it as near as possible to the top of your React component tree, as demonstrated below. Note that no components will have access to the media queries' match state just yet.

```javascript
// App.jsx
import React from "react";
// Optionally alias the Provider if you have more than one in your app
import {Provider as MediaQueryProvider} from "./react-mql-manager"
const queries = {
  mobile: "(max-width: 480px)",
  tablet: "(min-width: 481px) and (max-width: 1079px)",
  desktop: "(min-width: 1080px)"
};

const ReactApp = () => (
    <MediaQueryProvider queries={queries}>
        <div>
            <SomeChild />
        </div>
    </MediaQueryProvider>
)

export default ReactApp
```

Assume we want `<SomeChild />` to have access to the queries match state - we want a simple prop like: 
`{mobile: false, tablet: false, desktop: true}` if the viewport is >=1080px. The way to inject this object as a mediaQueries prop to `<SomeChild/>` is to use EITHER:

### withMediaQueries
```javascript
// SomeChild.jsx
import React from "react"
import { withMediaQueries } from "react-mql-manager"

const SomeChild = ({mediaQueries}) => {
    if(mediaQueries.desktop){
        // render something
    } else {
        // render something else
    }
}

export default withMediaQueries(SomeChild)
```

`<SomeChild />` now has access to mediaQueries, and will be updated if the media queries' match state changes.

Alternately:

### MediaQueriesRenderProps 
```javascript
// App.jsx
import React from "react"
import { Provider as MediaQueryProvider, MediaQueriesRenderProps } from "react-mql-manager"

const ReactApp = () => (
    <MediaQueryProvider queries={queries}>
        <div>
            <MediaQueriesRenderProps render={({mobile, tablet, desktop}) => (
                <SomeChild mediaQueries={{mobile, tablet, desktop}} />
            )} />
        </div>
    </MediaQueryProvider>
)
```
You can use `MediaQueriesRenderProps` anywhere beneath the `Provider` akin to `withMediaQueries`, and have it render any children neccesary via its render method, but not as children like you would do normally. The difference, as contrasted against `withMediaQueries`, is mostly stylistic - some would argue render props are more declarative, others might argue that they're needlessly so. 

# APIs
## Provider API
The Provider component accepts two properties, notably it does not need an onChange prop.

| Property | Type | Required | Description |
|:---|:---|:---:|:---|
| queries | object | ✓ | An object where the values must be valid css media query strings and the key names can be any string. Note that if you use the `<MediaQueriesRenderProps>` component, it's render method will use your queries' object keys as its arguments. |
| debounce | number | x | An optional debounce number (of microseconds) applied to the internally constructed onChange function. | 

## withMediaQueries API
withMediaQueries is a function accepting two positional arguments.

| Arguments | Type | Required | Description |
|:---|:---|:---:|:---|
| first argument | React Component | ✓ | A valid React component to render and pass mediaQueries (as a prop) to. |
| second argument | String | x | An optional custom name for the mediaQueries prop passed to your component (the first argument). Defaults to "mediaQueries". | 

## MediaQueriesRenderProps
MediaQueriesRenderProps does not accept children as props in the conventional way, but allows you to use its render prop to pass media queries' match state to any components you wish to render through it.  

| Property | Type | Required | Description |
|:---|:---|:---:|:---|
| render | Function | ✓ | A function with one argument - being an object whose keys are those of the queries prop you specified to your `<Provider>`, where the values are Booleans representing whether the query matches or not. 