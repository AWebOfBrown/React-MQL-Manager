import React from "react";
import { MediaQueriesRenderProps } from "../../index";
import { mount, shallow } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-15";
configure({ adapter: new Adapter() });

let shallowRender;

beforeAll(() => {
  shallowRender = shallow(
    <MediaQueriesRenderProps render={() => <div>hello </div>} />,
    {
      context: {
        __React_MQL_Manager_Subscription__: () => () => null,
        __React_MQL_Manager_Initial_State__: () => null
      }
    }
  );
});

describe(`MediaQueriesRenderProps`, () => {
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
