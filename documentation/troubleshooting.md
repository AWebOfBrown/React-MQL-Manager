# Troubleshooting

## I recieved "The MQL media query for  ... is being ignored, likely because the provided media query string for that key is invalid. Please alter this query string."
According to the [spec](https://www.w3.org/TR/css3-mediaqueries/#error-handling), a media query is represented as "not all" when one of its media features is not known. In plainer English: it is highly likely you wrote an invalid media query string. If this is not the case, please file an issue as it may indicate that this error should be a warning.

## The initial state of my media query matches is incorrect when using `MQLManager`.
If you use the Provider, this is taken care of for you. 

If you are using Redux or MobX, you need to initialise the state of the queries in your store, i.e. for each query: `[yourQueryName]: window.matchMedia(`${yourMediaQuery}`).matches` somewhere in your reducer. Likewise for MobX.

If you aren't using either, and you want to pass down the initial state as props directly, do the following:
```
class MyClass extends React.Component {
    myMQLManager = new MQLManager({
        queries,
        onChange: (newState) => this.setState({mediaQueries: newState}),
        debounce: 100,
        parentMounted: false
    })
    state = {mediaQueries: myMQLManager.getMatchState()}
    
    componentDidMount(){
        this.MQLManager.addListeners()
    }

    componentWillUnmount(){
        this.MQLManager.removeListeners()
    }

    render(){
        let {mediaQueries} = this.state
        return <SomeChild mediaQueries={mediaQueries}/>
    }
}
```