import {requireNativeComponent, NativeModules} from 'react-native';

export const WebVideoManager = requireNativeComponent('WebVideoManager', null);
export const FullScreenModule = NativeModules.FullScreenModule;
export const LocalServerModule = NativeModules.LocalServerModule;
export const StreamDownloaderModule = NativeModules.StreamDownloaderModule;

export const SecurePlayer = requireNativeComponent('SecurePlayerManager', null);
