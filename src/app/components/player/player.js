'use client'
import { useState, useEffect, useRef } from 'react';
import styles from './player.module.css';

const playlists = [
  {
    title: "Inuyasha Ost",
    artist: "By Toan",
    audioSrc: "./audio/playlist.mp3"
  },
  {
    title: "Japanese Indie Playlist",
    artist: "By Sumthing",
    audioSrc: "./audio/playlist2.mp3"
  },
];

const Player = () => {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(playlists[currentPlaylistIndex].audioSrc);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentPlaylistIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePrev = () => {
    const newIndex = (currentPlaylistIndex - 1 + playlists.length) % playlists.length;
    changeTrack(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentPlaylistIndex + 1) % playlists.length;
    changeTrack(newIndex);
  };

  const changeTrack = (index) => {
    setIsPlaying(false);
    setCurrentPlaylistIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.trackInfo}>
        <div className={`${styles.musicIcon} ${isPlaying ? styles.playing : ''}`}>🎵</div>
        <div className={styles.trackDetails}>
          <h4 className={styles.trackTitle}>{playlists[currentPlaylistIndex].title}</h4>
          <p className={styles.trackArtist}>{playlists[currentPlaylistIndex].artist}</p>
        </div>
      </div>
      
      <div className={styles.playerControls}>
        <button onClick={handlePrev} className={styles.playerBtn}>⏮</button>
        <button onClick={togglePlay} className={styles.playerBtn}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={handleNext} className={styles.playerBtn}>⏭</button>
      </div>
    </div>
  );
};

export default Player;