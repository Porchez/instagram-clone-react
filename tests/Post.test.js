import React from 'react';
import { shallow } from 'enzyme';
import Post from '../src/Post';

describe('<Post /> Test Suite', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Post />)
  })

  it('<Post /> match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})