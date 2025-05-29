import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { Button } from "@/client/components";
import { Accelerometer } from "expo-sensors";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THRESHOLD = 1.1;
const MIN_TIME_BETWEEN_STEPS = 300;
const AVERAGE_STEP_LENGTH = 0.762; // meters
const STORAGE_KEY = "@fitness_data";

interface FitnessData {
  steps: number;
  distance: number;
  startTime: number;
  endTime: number;
  locations: Location.LocationObject[];
}

export default function FitTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [lastStepTime, setLastStepTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location.LocationObject[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let accelerometerSubscription: { remove: () => void } | null = null;
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      try {
        // Request location permissions
        const { status: locationStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== "granted") {
          setErrorMessage(
            "Location permission is required for accurate tracking"
          );
          return;
        }

        // Start location tracking
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setLocations((prev) => [...prev, location]);
          }
        );

        // Start accelerometer tracking
        accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const currentTime = Date.now();

          if (
            magnitude > THRESHOLD &&
            currentTime - lastStepTime > MIN_TIME_BETWEEN_STEPS
          ) {
            setSteps((prevSteps) => {
              const newSteps = prevSteps + 1;
              // Calculate distance based on steps
              const newDistance = newSteps * AVERAGE_STEP_LENGTH;
              setDistance(newDistance);
              return newSteps;
            });
            setLastStepTime(currentTime);
          }
        });

        Accelerometer.setUpdateInterval(100);
      } catch (error) {
        console.error("Error starting tracking:", error);
        setErrorMessage(
          `Error starting tracking: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    };

    if (isTracking) {
      startTracking();
    }

    return () => {
      if (accelerometerSubscription) {
        accelerometerSubscription.remove();
      }
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTracking, lastStepTime]);

  const saveFitnessData = async (data: FitnessData) => {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const history = existingData ? JSON.parse(existingData) : [];
      history.push(data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Error saving fitness data:", error);
    }
  };

  const handleStartTracking = async () => {
    try {
      setErrorMessage(null);
      const { granted } = await Accelerometer.requestPermissionsAsync();

      if (granted) {
        setIsTracking(true);
        setSteps(0);
        setDistance(0);
        setLastStepTime(0);
        setLocations([]);
        setStartTime(Date.now());
      } else {
        setErrorMessage("Permission to access accelerometer was denied");
      }
    } catch (error) {
      console.error("Failed to start tracking:", error);
      setErrorMessage(
        `Error starting tracking: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleStopTracking = async () => {
    setIsTracking(false);
    const endTime = Date.now();

    if (startTime) {
      const fitnessData: FitnessData = {
        steps,
        distance,
        startTime,
        endTime,
        locations,
      };

      await saveFitnessData(fitnessData);

      Alert.alert(
        "Tracking Stopped",
        `Session Summary:\nSteps: ${steps}\nDistance: ${distance.toFixed(2)} meters\nDuration: ${((endTime - startTime) / 1000 / 60).toFixed(1)} minutes`
      );
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {errorMessage && (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      )}

      <Text style={{ fontSize: 24, marginBottom: 10 }}>Steps: {steps}</Text>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>
        Distance: {distance.toFixed(2)} meters
      </Text>
      {startTime && isTracking && (
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Duration: {((Date.now() - startTime) / 1000 / 60).toFixed(1)} minutes
        </Text>
      )}

      <Button
        text={isTracking ? "Stop Tracking" : "Start Tracking"}
        onPress={isTracking ? handleStopTracking : handleStartTracking}
      />
    </View>
  );
}
