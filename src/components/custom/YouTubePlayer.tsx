'use client';

import YouTube from 'react-youtube';
import React from 'react';

interface YouTubePlayerProps {
    videoId: string;
    width?: string;
    height?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    videoId,
    width = '100%',
    height = '390',
}) => {
    const opts = {
        height,
        width,
        playerVars: {
            autoplay: 0,
        },
    };

    return <YouTube videoId={videoId} opts={opts} />;
};

export default YouTubePlayer;
