import React, { useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton } from '@ionic/react';
import { camera, mic } from 'ionicons/icons';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import './Home.css';
import { generateSpeech } from '../hooks/visionex.js'; // Import the main function from visionex.js
import processAudio from '../hooks/audioex'; // Import the processAudio function

const Home: React.FC = () => {
  const { takePhoto } = usePhotoGallery();
  const [speechFileUrl, setSpeechFileUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleTakePhoto = async () => {
    console.log("Before takePhoto");
    // const photo = await takePhoto();
    // const imageUrl = photo.webviewPath ?? ""; // Assuming usePhotoGallery returns an object with webviewPath
    const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Palacio_Real%2C_%C3%81msterdam%2C_Pa%C3%ADses_Bajos%2C_2016-05-30%2C_DD_07-09_HDR.jpg";
    
    try {
      const base64Audio = await generateSpeech(imageUrl); // Pass the image URL to the main function
      console.log("After generateSpeech");

      if (!base64Audio) {
        throw new Error("Failed to generate speech");
      }

      // Convert Base64 to Blob
      const binaryString = atob(base64Audio);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });

      // Create a URL for the Blob and set it to the state
      const speechUrl = URL.createObjectURL(blob);
      setSpeechFileUrl(speechUrl);
      console.log("Speech URL:", speechUrl);
    } catch (error) {
      console.error("Error in generateSpeech:", error);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (base64Audio) {
            await processAudio(base64Audio);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={handleTakePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonButton onClick={handleStartRecording}>
          <IonIcon icon={mic} />
          Start Recording
        </IonButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonButton onClick={handleStopRecording}>
          Stop Recording
        </IonButton>
        {speechFileUrl && (
          <audio controls>
            <source src={speechFileUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;