import React from 'react';
import { SvgXml } from 'react-native-svg';

const PlayCircleIcon = ({width = "24px", height = "24px"}) => {
    const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <style>.fa-secondary{opacity:.4}</style>
      </defs>
      <path class="fa-primary" fill="#5065c6" d="M212.5 147.5c-7.4-4.5-16.7-4.7-24.3-.5s-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88z"/>
      <path class="fa-secondary" fill="#7ca5fd" d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/>
    </svg>
  `;

    return <SvgXml xml={svgMarkup} width={width} height={height} />;
};

export default PlayCircleIcon;
