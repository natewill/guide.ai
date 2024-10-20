import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const App: React.FC = () => {

  const openCamera = async () => {
    try {
      // Request camera permission and open the camera
      const permissions = await Camera.requestPermissions();

      if (permissions.camera === 'granted') {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri, // Capture the photo as a file URI
          source: CameraSource.Camera,     // Use the device's camera
          quality: 100                     // Set the quality of the image
        });
        // Log or display the image URI
        console.log('Photo captured:', photo.webPath);
        const imageElement = document.getElementById('capturedImage') as HTMLImageElement;
        if (imageElement && photo.webPath) {
          imageElement.src = photo.webPath;
        }
      } else {
        console.error('Camera permission denied');
      }
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  // Use useEffect to trigger the camera when the app loads
  useEffect(() => {
    openCamera();
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Camera App</h1>
      <img id="capturedImage" alt="Captured Photo" style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;