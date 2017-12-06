import React from "react";
import { mount } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-15";
configure({ adapter: new Adapter() });

import { MediaQueriesRenderProps, Provider } from "../../../index";
import { queries, mockMatchMedia, queriesMatchState } from "../../testUtils";

class FalseFromSCU extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return this.props.children;
  }
}

// avoids unknown prop warning if passing mediaQueries to a simple div
class Child extends React.Component {
  render() {
    return <div />;
  }
}

let wrapper;
let subscribeFnSpy;

describe("MQLManager's Provider and MediaQueriesRenderProps", () => {
  beforeAll(() => {
    window.matchMedia = mockMatchMedia;
    subscribeFnSpy = jest.spyOn(Provider.prototype, "subscribe");
    wrapper = mount(
      <Provider queries={queries}>
        <FalseFromSCU>
          <MediaQueriesRenderProps
            render={({ S, M, L }) => <Child mediaQueries={{ S, M, L }} />}
          />
        </FalseFromSCU>
      </Provider>
    );
  });

  it(`MQRP should pass a mediaQueries' values to child elements in its render method`, () => {
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .props()
    ).toHaveProperty("mediaQueries");
  });

  it(`the mediaQueries prop should be an object where keys are those of Provider's queries prop, values are booleans`, () => {
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .props().mediaQueries
    ).toMatchObject(queriesMatchState);
  });

  it(`Provider should succesfully update elements, returned from MQRP render method, upon broadcast`, () => {
    let broadcastValue = {
      S: false,
      M: false,
      L: true
    };
    wrapper.instance().broadcast(broadcastValue);
    wrapper.update();
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .childAt(0)
        .props().mediaQueries
    ).toMatchObject(broadcastValue);
  });

  it(`Provider's subscribe should be called once, via context, by MQRP when the latter mounts`, () => {
    expect(subscribeFnSpy).toHaveBeenCalled();
  });

  it("Provider should then have one subscription", () => {
    expect(wrapper.instance().subscriptions).toHaveLength(1);
  });

  it(`MQRP unsubscribe() should remove reference to it's setState() from Provider's this.subscriptions`, () => {
    wrapper
      .childAt(0)
      .childAt(0)
      .instance()
      .unsubscribe();

    expect(wrapper.instance().subscriptions).toHaveLength(0);
  });
});
