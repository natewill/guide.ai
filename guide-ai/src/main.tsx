import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, CameraResultType } from '@capacitor/camera';

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      if (image.webPath) {
        setImageUrl(image.webPath);
      } else {
        console.error('Error: image.webPath is undefined');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  return (
    <div>
      <h1>Capacitor Camera Example</h1>
      <button onClick={takePicture}>Take Picture</button>
      {imageUrl && <img src={imageUrl} alt="Captured" />}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}