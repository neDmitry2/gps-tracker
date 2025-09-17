import { LocationObjectCoords } from 'expo-location';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapDisplayRef {
  postMessage: (message: string) => void;
}

interface MapDisplayProps {
  route: LocationObjectCoords[];
  initialLocation: LocationObjectCoords | null;
  fitToRoute?: boolean;
}

const MapDisplay = forwardRef<MapDisplayRef, MapDisplayProps>((props, ref) => {
  const webViewRef = useRef<WebView>(null);
  const { route, initialLocation, fitToRoute = false } = props;
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  
  useImperativeHandle(ref, () => ({
    postMessage: (message: string) => {
      webViewRef.current?.postMessage(message);
    },
  }));
  
useEffect(() => {
    if (isWebViewReady && webViewRef.current && route.length > 0) {
      const command = { type: 'route', payload: route, fitToRoute: fitToRoute };
      webViewRef.current.postMessage(JSON.stringify(command));
    }
  }, [route, fitToRoute, isWebViewReady]);
 
  //Запускается один раз в начале
  const handleMapLoad = () => {
    if (initialLocation && webViewRef.current) {
      const command = { type: 'initial', payload: initialLocation };
      webViewRef.current.postMessage(JSON.stringify(command));
    }
    setIsWebViewReady(true);
  };

  return (
    <View style={styles.map}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={require('../assets/map.html')}
        style={styles.webview}
        javaScriptEnabled={true}
        scrollEnabled={false}
        onLoad={handleMapLoad}
      />
    </View>
  );
});

export default MapDisplay;

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
});
