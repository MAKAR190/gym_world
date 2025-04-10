import React, { ReactNode } from "react";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerProps,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { usePullToRefresh } from "@/client/hooks/PullToRefresh";
import LottieView from "lottie-react-native";

const RefreshLoader = ({
  progress,
  isRefreshCompleted,
}: {
  progress: number;
  isRefreshCompleted: boolean;
}) => {
  const animationRef = React.useRef<LottieView>(null);

  return (
    <LottieView
      ref={animationRef}
      source={require("../assets/animations/gym-loading-animation.json")}
      autoPlay={!isRefreshCompleted}
      loop={!isRefreshCompleted}
      style={{ width: 100, height: 100 }}
      progress={progress}
      speed={3}
    />
  );
};

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  pullThreshold?: number;
  maxPullDistance?: number;
  LoaderComponent?: React.ComponentType<{
    progress: number;
    isRefreshCompleted: boolean;
  }>;
  gestureHandlerProps?: Partial<PanGestureHandlerProps>;
  simultaneousHandlers?: React.Ref<unknown> | React.Ref<unknown>[];
}

export const PullToRefresh = ({
  children,
  onRefresh,
  pullThreshold,
  maxPullDistance,
  LoaderComponent = RefreshLoader,
  gestureHandlerProps,
  simultaneousHandlers,
}: PullToRefreshProps) => {
  const {
    gestureHandler,
    loaderAnimatedStyle,
    onGestureEvent,
    onHandlerStateChange,
    animatedProps,
    isRefreshCompleted,
  } = usePullToRefresh({
    onRefresh,
    pullThreshold,
    maxPullDistance,
  });

  return (
    <GestureHandlerRootView className="flex-1">
      <Animated.View
        className="absolute left-0 right-0 z-10 items-center"
        style={loaderAnimatedStyle}
      >
        <LoaderComponent
          progress={animatedProps.progress ?? 0}
          isRefreshCompleted={isRefreshCompleted}
        />
      </Animated.View>

      <PanGestureHandler
        ref={gestureHandler}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={[-10, 10]}
        simultaneousHandlers={simultaneousHandlers}
        {...gestureHandlerProps}
      >
        <Animated.View className="flex-1">{children}</Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};
