const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
  
      videoElement.onloadedmetadata = () => {
        resolve(videoElement.duration);
        URL.revokeObjectURL(videoElement.src);
      };
  
      videoElement.onerror = () => {
        reject('Erro ao carregar o vídeo');
        URL.revokeObjectURL(videoElement.src);
      };
  
      const url = URL.createObjectURL(file);
      videoElement.src = url;
    });
  };

  
  export default getVideoDuration;