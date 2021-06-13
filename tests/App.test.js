import React from 'react';
import { shallow } from 'enzyme';
import App from '../src/App';

describe('<App /> Test Suite', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<App />)
  })

  it('Match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})