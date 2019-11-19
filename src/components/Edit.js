import React from 'react'
import { Row, Col, Input, Icon, Tag, Affix, Card, Divider } from 'antd'
import { Route } from 'react-router-dom'
import { Base64 } from 'js-base64'
import mermaid from '@mermaid-js/mermaid'

import Error from './Error'
import Preview from './Preview'
import pkg from '@mermaid-js/mermaid/package.json'
import { base64ToState } from '../utils'

const mermaidVersion = pkg.version

class Edit extends React.Component {
  constructor (props) {
    super(props)
    this.handleOnCodeChange = this.handleOnCodeChange.bind(this)
    this.handleOnMermaidConfigChange = this.handleOnMermaidConfigChange.bind(this)

    const {
      match: {
        params: { base64 }
      },
      location: { search }
    } = this.props
    this.json = base64ToState(base64, search)
    mermaid.initialize(this.json.mermaid)
  }

  handleOnCodeChange (event) {
    const { history, match: { path } } = this.props
    this.json.code = event.target.value
    const base64 = Base64.encodeURI(JSON.stringify(this.json))
    history.push(path.replace(':base64', base64))
  }

  handleOnMermaidConfigChange (event) {
  onKeyDown (event) {
    const keyCode = event.keyCode || event.which

    // 9 is key code for TAB
    if (keyCode === 9) {
      event.preventDefault()
      const TAB_SIZE = 4
      document.execCommand('insertText', false, ' '.repeat(TAB_SIZE))
    }
  }

  onMermaidConfigChange (event) {
    const str = event.target.value
    const {
      history,
      match: { path, url }
    } = this.props
    try {
      const config = JSON.parse(str)
      mermaid.initialize(config)
      this.json.mermaid = config
      const base64 = Base64.encodeURI(JSON.stringify(this.json))
      history.push(path.replace(':base64', base64))
    } catch (e) {
      const base64 = Base64.encodeURI(e.message)
      history.push(`${url}/error/${base64}`)
    }
  }

  render () {

    const { match: { url } } = this.props
    return <div>
      <h1>Mermaid Live Editor</h1>
      <Divider />
      <Row gutter={16}>
        <Col span={8}>
          <Affix>
            <Card title='Code'>
              <Input.TextArea autosize={{ minRows: 4, maxRows: 16 }} value={this.json.code} onChange={this.handleOnCodeChange} />
            </Card>
          </Affix>
          <Card title='Mermaid configuration'>
            <Input.TextArea autosize={{ minRows: 4, maxRows: 16 }} defaultValue={JSON.stringify(this.json.mermaid, null, 2)} onChange={this.handleOnMermaidConfigChange} />
          </Card>
          <Card title='Links'>
            <ul className='marketing-links'>
              <li><a href='https://mermaidjs.github.io/' target='_blank' rel='noopener noreferrer'><Icon type='book' /> Mermaid Documentation</a></li>
              <li><a href='https://github.com/knsv/mermaid' target='_blank' rel='noopener noreferrer'><Icon type='github' /> Mermaid on GitHub</a></li>
              <li><a href='https://github.com/mermaidjs/mermaid-gitbook' target='_blank' rel='noopener noreferrer'><Icon type='github' /> Documentation on GitHub</a></li>
              <li><a href='https://github.com/mermaidjs/mermaid-live-editor' target='_blank' rel='noopener noreferrer'><Icon type='github' /> Live Editor on GitHub</a></li>
              <li><a href='https://github.com/mermaidjs/mermaid.cli' target='_blank' rel='noopener noreferrer'><Icon type='github' /> Mermaid CLI</a></li>
            </ul>
          </Card>
        </Col>
        <Col span={16}>
          <Route exact path={url} render={(props) => <Preview {...props} code={this.json.code} />} />
          <Route path={url + '/error/:base64'} component={Error} />
          <h3 style={{ textAlign: 'right' }}>Powered by mermaid <Tag color='green'>{mermaidVersion}</Tag></h3>
        </Col>
      </Row>
    </div>

    const {
      match: { url }
    } = this.props
    return (
      <div>
        <h1>Mermaid Live Editor</h1>
        <Divider />
        <Row gutter={16}>
          <Col span={8}>
            <Affix>
              <Card title='Code'>
                <Input.TextArea
                  autosize={{ minRows: 4, maxRows: 16 }}
                  value={this.json.code}
                  onChange={this.onCodeChange}
                  onKeyDown={this.onKeyDown}
                />
              </Card>
            </Affix>
            <Card title='Mermaid configuration'>
              <Input.TextArea
                autosize={{ minRows: 4, maxRows: 16 }}
                defaultValue={JSON.stringify(this.json.mermaid, null, 2)}
                onChange={this.onMermaidConfigChange}
                onKeyDown={this.onKeyDown}
              />
            </Card>
            <Card title='Links'>
              <ul className='marketing-links'>
                <li>
                  <a href='https://mermaidjs.github.io/' target='_blank'>
                    <Icon type='book' /> Mermaid Documentation
                  </a>
                </li>
                <li>
                  <a href='https://github.com/knsv/mermaid' target='_blank'>
                    <Icon type='github' /> Mermaid on GitHub
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/mermaidjs/mermaid-gitbook'
                    target='_blank'
                  >
                    <Icon type='github' /> Documentation on GitHub
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/mermaidjs/mermaid-live-editor'
                    target='_blank'
                  >
                    <Icon type='github' /> Live Editor on GitHub
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/mermaidjs/mermaid.cli'
                    target='_blank'
                  >
                    <Icon type='github' /> Mermaid CLI
                  </a>
                </li>
              </ul>
            </Card>
          </Col>
          <Col span={16}>
            <Route
              exact
              path={url}
              render={props => <Preview {...props} code={this.json.code} />}
            />
            <Route path={url + '/error/:base64'} component={Error} />
            <h3 style={{ textAlign: 'right' }}>
              Powered by mermaid <Tag color='green'>{mermaidVersion}</Tag>
            </h3>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Edit
