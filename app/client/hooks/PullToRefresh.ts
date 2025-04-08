import { useRef, useState, useCallback, useEffect } from "react";
import {
  GestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useAnimatedProps,
  cancelAnimation,
} from "react-native-reanimated";

interface UsePullToRefreshProps {
  onRefresh?: () => Promise<void> | void;
  pullThreshold?: number;
  maxPullDistance?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  pullThreshold = 40,
  maxPullDistance = 40,
}: UsePullToRefreshProps = {}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isRefreshCompleted, setIsRefreshCompleted] = useState(false);
  const pullDistanceAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);
  const gestureHandler = useRef(null);
  const isFirstRenderRef = useRef(true);

  const isMountedRef = useRef(true);

  const refreshStateRef = useRef({
    isRefreshing: false,
    isCompleted: false,
  });

  useEffect(() => {
    refreshStateRef.current.isRefreshing = refreshing;
    refreshStateRef.current.isCompleted = isRefreshCompleted;
  }, [refreshing, isRefreshCompleted]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cancelAnimation(pullDistanceAnim);
      cancelAnimation(progressAnim);
      clearAllTimeouts();
    };
  }, [pullDistanceAnim, progressAnim]);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const safeSetTimeout = (callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter(
        (id) => id !== timeoutId
      );

      if (isMountedRef.current) {
        callback();
      }
    }, delay);

    timeoutsRef.current.push(timeoutId);

    return timeoutId;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const hardReset = useCallback(() => {
    cancelAnimation(pullDistanceAnim);
    cancelAnimation(progressAnim);

    pullDistanceAnim.value = 0;
    progressAnim.value = 0;

    setRefreshing(false);
    setIsRefreshCompleted(false);

    clearAllTimeouts();
  }, [pullDistanceAnim, progressAnim]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      hardReset();
      isFirstRenderRef.current = false;
    }
  }, [hardReset]);

  const loaderAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: pullDistanceAnim.value,
      opacity: progressAnim.value,
    };
  });

  const handleRefresh = async () => {
    cancelAnimation(pullDistanceAnim);
    cancelAnimation(progressAnim);

    clearAllTimeouts();

    setRefreshing(true);
    setIsRefreshCompleted(false);

    pullDistanceAnim.value = withSpring(50);

    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
        setIsRefreshCompleted(true);

        progressAnim.value = withTiming(1, { duration: 300 });

        safeSetTimeout(() => {
          progressAnim.value = withTiming(0, { duration: 200 });
          pullDistanceAnim.value = withSpring(0, {
            damping: 15,
            stiffness: 100,
          });

          safeSetTimeout(() => {
            setIsRefreshCompleted(false);
          }, 300);
        }, 500);
      }
    }
  };

  const onGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    if (
      refreshStateRef.current.isRefreshing ||
      refreshStateRef.current.isCompleted
    ) {
      return;
    }

    const { translationY } = event.nativeEvent;

    if (translationY > 0) {
      pullDistanceAnim.value = Math.min(translationY, maxPullDistance);
      const progressValue = Math.min(translationY / pullThreshold, 1);
      progressAnim.value = progressValue;
    }
  };

  const onHandlerStateChange = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    if (
      refreshStateRef.current.isRefreshing ||
      refreshStateRef.current.isCompleted
    ) {
      return;
    }

    const { state, translationY } = event.nativeEvent;

    if (state === 5) {
      if (translationY > pullThreshold) {
        handleRefresh();
      } else {
        pullDistanceAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
        progressAnim.value = withTiming(0, { duration: 200 });
      }
    }
  };

  const animatedProps = useAnimatedProps(() => {
    return {
      progress: progressAnim.value,
    };
  });

  return {
    refreshing,
    gestureHandler,
    loaderAnimatedStyle,
    onGestureEvent,
    onHandlerStateChange,
    progressAnim,
    animatedProps,
    isRefreshCompleted,
    hardReset,
  };
};
