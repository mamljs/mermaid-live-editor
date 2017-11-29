/* eslint-env jest */

import React from 'react'
import { mount } from 'enzyme'
import { Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Base64 } from 'js-base64'

import 'mermaid'
import App, { defaultCode } from '../src/components/App'

let wrapper = null
beforeEach(() => {
  wrapper = mount(<App />)
})

const verifyTextArea = (code) => {
  const textArea = wrapper.find(Input.TextArea).first()
  expect(textArea).toBeDefined()
  expect(textArea.props().value).toEqual(code)
}

const verifyButtons = (code) => {
  const buttons = wrapper.find(Button)
  expect(buttons.length).toEqual(2)
  const link = buttons.at(0).find(Link).first()
  expect(link.props().children).toEqual('Link to View')
  expect(link.props().to).toEqual('/view/' + Base64.encodeURI(code))
  expect(buttons.at(1).props().children).toEqual('Download SVG')
}

test('/', () => {
  verifyTextArea(defaultCode)
  verifyButtons(defaultCode)
})
