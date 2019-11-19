import React from 'react'
import { Divider, Card } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Base64 } from 'js-base64'
import mermaid from 'mermaid'
import { upload } from './uploader'
//import mermaid from '@mermaid-js/mermaid'


class Preview extends React.Component {
  constructor (props) {
    super(props)
    this.handleOnDownloadSVG = this.handleOnDownloadSVG.bind(this)
    this.handleOnDownloadImage = this.handleOnDownloadImage.bind(this)
  }

  handleOnDownloadSVG (event) {
    event.target.href = `data:image/svg+xml;base64,${Base64.encode(this.container.innerHTML)}`
    event.target.download = `mermaid-diagram-${moment().format('YYYYMMDDHHmmss')}.svg`
    event.target.download = `mermaid-diagram-${moment().format(
      'YYYYMMDDHHmmss'
    )}.svg`
  }

  handleOnDownloadImage (event) {
    const svgObject = `data:image/svg+xml;base64,${Base64.encode(this.container.innerHTML)}`
    // console.log('Uploading SVG image now');
    event.target.href = upload(svgObject)

    event.target.download = 'couple.jpg'
  }

  render () {
    const { code, match: { url } } = this.props
    return <div>
      <Card title='Preview'>
        <div ref={div => { this.container = div }}>{code}</div>
      </Card>
      <Card title='Actions'>
        <div className='links'>
          <Link to={url.replace('/edit/', '/view/')}>Link to View</Link>
          <Divider type='vertical' />
          <a href='' download='' onClick={this.handleOnDownloadSVG}>Download SVG</a>
          <Divider type='vertical' />
          <a href='' download='' target='_blank' onClick={this.handleOnDownloadImage}>Download Image</a>
        </div>
      </Card>
    </div>
  }

  initMermaid () {
    const {
      code,
      history,
      match: { url }
    } = this.props
    try {
      mermaid.parse(code)
      // Replacing special characters '<' and '>' with encoded '&lt;' and '&gt;'
      let _code = code
      _code = _code.replace(/</g, '&lt;')
      _code = _code.replace(/>/g, '&gt;')
      // Overriding the innerHTML with the updated code string
      this.container.innerHTML = _code
      mermaid.init(undefined, this.container)
    } catch (e) {
      // {str, hash}
      const base64 = Base64.encodeURI(e.str || e.message)
      history.push(`${url}/error/${base64}`)
    }
  }

  componentDidMount () {
    this.initMermaid()
  }

  componentDidUpdate () {
    this.container.removeAttribute('data-processed')
    this.container.innerHTML = this.props.code.replace(
      'onerror=',
      'onerror&equals;'
    )
    this.initMermaid()
  }
}

export default Preview
