import React from 'react'
import FileReaderInput from 'react-file-reader-input'

import Button from 'rebass/dist/Button'

import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'
import MdOpenInBrowser from 'react-icons/lib/md/open-in-browser'
import MdSettings from 'react-icons/lib/md/settings'
import MdInfo from 'react-icons/lib/md/info'
import MdLayers from 'react-icons/lib/md/layers'
import MdSave from 'react-icons/lib/md/save'
import MdStyle from 'react-icons/lib/md/style'
import MdMap from 'react-icons/lib/md/map'
import MdInsertEmoticon from 'react-icons/lib/md/insert-emoticon'
import MdFontDownload from 'react-icons/lib/md/font-download'
import MdHelpOutline from 'react-icons/lib/md/help-outline'
import MdFindInPage from 'react-icons/lib/md/find-in-page'

import SettingsModal from './modals/SettingsModal'
import TilesetsModal from './modals/TilesetsModal'

import style from '../libs/style'
import colors from '../config/colors';

const InlineBlock = props => <div style={{display: "inline-block", ...props.style}}>
  {props.children}
</div>

export default class Toolbar extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    // A new style has been uploaded
    onStyleUpload: React.PropTypes.func.isRequired,
    // Current style is requested for download
    onStyleDownload: React.PropTypes.func.isRequired,
    // Style is explicitely saved to local cache
    onStyleSave: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      openSettingsModal: false,
      openTilesetsModal: false,
    }
  }

  onUpload(_, files) {
    const [e, file] = files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      let mapStyle = JSON.parse(e.target.result)
      mapStyle = style.ensureMetadataExists(mapStyle)
      this.props.onStyleUpload(mapStyle);
    }
    reader.onerror = e => console.log(e.target);
  }

  saveButton() {
    if(this.props.mapStyle.layers.length > 0) {
      return <InlineBlock>
        <Button onClick={this.props.onStyleSave} big={true}>
          <MdSave />
          Save
        </Button>
      </InlineBlock>
    }
    return null
  }

  downloadButton() {
    return <InlineBlock>
      <Button onClick={this.props.onStyleDownload} big={true}>
        <MdFileDownload />
        Download
      </Button>
    </InlineBlock>
  }

  toggleSettings() {
    this.setState({openSettingsModal: !this.state.openSettingsModal})
  }

  toggleTilesets() {
    this.setState({openTilesetsModal: !this.state.openTilesetsModal})
  }

  render() {
    return <div style={{
      position: "fixed",
      height: 40,
      width: '100%',
      zIndex: 100,
      left: 0,
      top: 0,
      backgroundColor: colors.black
    }}>
      <SettingsModal
        mapStyle={this.props.mapStyle}
        onStyleChanged={this.props.onStyleChanged}
        open={this.state.openSettingsModal}
        toggle={() => this.toggleSettings.bind(this)}
      />
      <TilesetsModal
        mapStyle={this.props.mapStyle}
        onStyleChanged={this.props.onStyleChanged}
        open={this.state.openTilesetsModal}
        toggle={() => this.toggleSettings.bind(this)}
      />
      <InlineBlock>
        <Button style={{
          width: 180,
          textAlign: 'left',
          backgroundColor: colors.black
        }}>
          <img src="https://github.com/maputnik/editor/raw/master/media/maputnik.png" alt="Maputnik" style={{width: 30, height: 30, paddingRight: 5, verticalAlign: 'middle'}}/>
          <span style={{fontSize: 20, verticalAlign: 'middle' }}>Maputnik</span>
        </Button>
      </InlineBlock>
      <InlineBlock>
        <FileReaderInput onChange={this.onUpload.bind(this)}>
          <Button big={true}>
            <MdOpenInBrowser />
            Open
          </Button>
        </FileReaderInput>
      </InlineBlock>
      {this.downloadButton()}
      {this.saveButton()}
      <InlineBlock>
        <Button big={true} onClick={this.toggleTilesets.bind(this)}>
          <MdLayers />
          Tilesets
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.toggleSettings.bind(this)}>
          <MdSettings />
          Style Settings
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.toggleSettings.bind(this)}>
          <MdFindInPage />
          Inspect
        </Button>
      </InlineBlock>
      <InlineBlock>
        <Button big={true} onClick={this.props.onOpenAbout}>
          <MdHelpOutline />
          Help
        </Button>
      </InlineBlock>
    </div>
  }
}
