import { Asset } from 'expo-asset';
import { LocationObjectCoords } from 'expo-location';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapDisplayRef {
  postMessage: (message: string) => void;
}

const mapHtmlModule = require('../assets/map.html');

interface MapDisplayProps {
  route: LocationObjectCoords[];
  initialLocation: LocationObjectCoords | null;
  fitToRoute?: boolean;
}

const MapDisplay = forwardRef<MapDisplayRef, MapDisplayProps>((props, ref) => {
  const webViewRef = useRef<WebView>(null);
  const { route, initialLocation, fitToRoute = false } = props;
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const [mapUri, setMapUri] = useState<string | null>(null);
  
  useImperativeHandle(ref, () => ({
    postMessage: (message: string) => {
      webViewRef.current?.postMessage(message);
    },
  }));
  
  useEffect(() => {
    const loadHtmlAsset = async () => {
      const asset = Asset.fromModule(mapHtmlModule);
      await asset.downloadAsync();
      setMapUri(asset.localUri);
    };

    loadHtmlAsset().catch(console.error);
  }, []);
  
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

  if (!mapUri) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  
  return (
    <View style={styles.map}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ uri: mapUri }}
        style={styles.webview}
        javaScriptEnabled={true}
        scrollEnabled={false}
        onLoad={handleMapLoad}
        allowFileAccess={true}
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
    backgroundColor: '#f0f0f0'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
