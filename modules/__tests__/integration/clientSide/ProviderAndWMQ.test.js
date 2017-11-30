import React from "react";
import { mount } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-15";
configure({ adapter: new Adapter() });

import { withMediaQueries, Provider } from "../../../index";
import { queries, mockMatchMedia, queriesMatchState } from "../../testUtils";

class FalseFromSCU extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return this.props.children;
  }
}

let Child;
let ChildWithMediaQueries;
let optionalPropName;
let wrapper;
let subscribeFnSpy;

beforeAll(() => {
  Child = () => <div />;
  window.matchMedia = mockMatchMedia;
  // withMediaQueries accepts a second paramater, which is used to
  // assign a custom prop name for the media queries' match state
  // passed to the wrapped child, hence "optionalPropName" below:
  optionalPropName = "MQs";
  ChildWithMediaQueries = withMediaQueries(Child, optionalPropName);
  subscribeFnSpy = jest.spyOn(Provider.prototype, "subscribe");
  wrapper = mount(
    <Provider queries={queries}>
      <FalseFromSCU>
        <ChildWithMediaQueries />
      </FalseFromSCU>
    </Provider>
  );
});

describe("MQLManager's Provider and withMediaQueries HOC", () => {
  it(`withMediaQueries should pass a mediaQueries prop (optionally renamed) to a wrapped child`, () => {
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .props()
    ).toHaveProperty(optionalPropName);
  });

  it(`the mediaQueries prop should be an object where keys are those of Provider's queries prop, values are booleans`, () => {
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .props()[optionalPropName]
    ).toMatchObject(queriesMatchState);
  });

  it(`Provider should succesfully update child of withMediaQueries on broadcast`, () => {
    let broadcastValue = { providerWorks: true };
    wrapper.instance().broadcast(broadcastValue);
    wrapper.update();
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .props()[optionalPropName] // broadcast updates wrapped component's optionally named prop
    ).toMatchObject(broadcastValue);
  });

  it(`Provider's subscribe should be called once, via context, by withMediaQueries when the latter mounts`, () => {
    expect(subscribeFnSpy).toHaveBeenCalled();
  });

  it("Provider should then have one subscription", () => {
    expect(wrapper.instance().subscriptions).toHaveLength(1);
  });

  it(`withMediaQueries unsubscribe() should remove reference to it's setState() from Provider's this.subscriptions`, () => {
    wrapper
      .childAt(0)
      .childAt(0)
      .instance()
      .unsubscribe();

    expect(wrapper.instance().subscriptions).toHaveLength(0);
  });
});
