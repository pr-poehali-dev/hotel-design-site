const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playWinSound = (type: 'small' | 'medium' | 'big') => {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'big') {
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    frequencies.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(freq, now + index * 0.15);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, now + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.5);
      
      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.5);
    });
  } else if (type === 'medium') {
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    oscillator.start(now);
    oscillator.stop(now + 0.4);
  } else {
    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
};

export const playSpinSound = () => {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(200, now);
  oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  oscillator.start(now);
  oscillator.stop(now + 0.1);
};

export const playScratchSound = () => {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const bufferSize = audioContext.sampleRate * 0.5;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  source.buffer = buffer;
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, now);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(0.05, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  source.start(now);
  source.stop(now + 0.3);
};
