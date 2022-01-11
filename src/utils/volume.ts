export const getInitialVolume = () => {
  const volume = localStorage.getItem('volume');
  return (volume && Number.parseInt(volume, 10)) || 100;
}

export const saveVolume = (value: number) => localStorage.setItem('volume', value.toString());