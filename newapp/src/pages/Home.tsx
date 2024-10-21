import React, { useState, useRef, useEffect } from 'react';
import { IonSpinner, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton, IonLabel } from '@ionic/react';
import { camera, mic } from 'ionicons/icons';
import './Home.css';
import { Camera, CameraResultType } from '@capacitor/camera';
import { generateSpeech } from '../hooks/visionex.js'; // Import the main function from visionex.js
import  processAudio  from '../hooks/audioex'; // Import the processAudio function

const Home: React.FC = () => {
  const [speechBase64, setBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    setLoading(true);
    var imageUrl = image.base64String ?? "";
    try {
      const base64Audio = await generateSpeech(imageUrl); // Pass the image URL to the main function
      console.log("After generateSpeech");

      if (!base64Audio) {
        throw new Error("Failed to generate speech");
      }

      setBase64(base64Audio);
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      await handleStopRecording();
    } else {
      await handleStartRecording();
    }
    setIsRecording(!isRecording);
  };

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      console.log("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const base64Audio = await convertBlobToBase64(audioBlob);

          // Process the audio if needed
          const processedAudio = await processAudio(base64Audio);
          setLoading(false);
          setBase64(processedAudio ?? null);
          audioChunksRef.current = []; // Clear the audio chunks
        };
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (audioRef.current && speechBase64) {
      audioRef.current.src = `data:audio/mp3;base64,${speechBase64}`;
    }
  }, [speechBase64]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonTitle>Bonvoy Ai</IonTitle>
        {loading ? (
          <IonButton>
            <IonSpinner name="dots" />
            Loading...
          </IonButton>
        ) : (
          speechBase64 && (
            <audio ref={audioRef} controls>
              <source src={`data:audio/mp3;base64,${speechBase64}`} />
              Your browser does not support the audio element.
            </audio>
          )
        )}
      </IonContent>
      <IonFab slot="fixed" vertical="bottom" horizontal="center">
        <IonFabButton onClick={takePicture}>
          <IonIcon icon={camera} />
        </IonFabButton>

        <IonFabButton onClick={handleToggleRecording}>
          <IonIcon icon={mic} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Home;