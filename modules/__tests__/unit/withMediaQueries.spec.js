import React from "react";
import { withMediaQueries } from "../../index";
import { mount, shallow } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-15";
configure({ adapter: new Adapter() });

const Wrapped = ({}) => <div>hello</div>;
let WrappedWMQ;
let shallowRender;
let customPropName = "customPropName";
beforeAll(() => {
  WrappedWMQ = withMediaQueries(Wrapped, customPropName);
  shallowRender = shallow(<WrappedWMQ />, {
    context: {
      mediaQueriesSubscription: () => () => null
    }
  });
});

describe(`withMediaQueries`, () => {
  test(`unsubscribe should be a function`, () => {
    expect(typeof shallowRender.instance().unsubscribe === "function").toBe(
      true
    );
  });

  test(`should call unsubscribe on un-mount`, () => {
    const unsubSpy = jest.spyOn(shallowRender.instance(), "unsubscribe");
    shallowRender.unmount();
    expect(unsubSpy).toHaveBeenCalled();
  });
});
