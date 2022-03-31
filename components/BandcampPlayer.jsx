import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BandcampPlayer extends Component {
  getUrl() {
    const {
      album,
      size,
      bgcol,
      linkcol,
      merch,
      tracklist,
      artwork,
    } = this.props;

    const merchString = merch ? `/package=${merch}` : '';
    const tracklistString = tracklist ? '' : '/tracklist=false';
    const artworkString = artwork ? `/artwork=${artwork}` : '';

    return `https://bandcamp.com/EmbeddedPlayer/album=${album}/size=${size}/bgcol=${bgcol}/linkcol=${linkcol}${merchString}${tracklistString}${artworkString}/`;
  }

  getStyles() {
    const {
      height,
      width,
    } = this.props;

    return {
      border: 0,
      width,
      height,
    };
  }

  render() {
    const { title, onLoad, style } = this.props;
    const getStyle = this.getStyles();
    const src = this.getUrl();
    return (
      <iframe
        title={title}
        style={{
          ...style,
          ...getStyle
        }}
        className="bandcamp-player"
        src={src}
        seamless
        onLoad={onLoad}
      />
    );
  }
}

BandcampPlayer.propTypes = {
  album: PropTypes.string.isRequired,
  size: PropTypes.string,
  bgcol: PropTypes.string,
  linkcol: PropTypes.string,
  merch: PropTypes.string,
  tracklist: PropTypes.string,
  artwork: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};

BandcampPlayer.defaultProps = {
  size: 'large',
  bgcol: 'ffffff',
  linkcol: '0687f5',
  merch: null,
  tracklist: 'true',
  artwork: 'big',
  height: 'auto',
  width: 'auto',
  title: 'Bandcamp player',
};

export default BandcampPlayer;
