package com.atg.managers

import com.atg.native_modules.FullScreenModule
import com.example.secure_exoplayer.AndroidAsyncServer
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import timber.log.Timber

class FullScreenManager(
    private val reactContext: ReactApplicationContext
): ReactContextBaseJavaModule(reactContext), LifecycleEventListener {
    override fun getName() = REACT_CLASS
    private var fullScreenEnabled = false
    private val fullScreenModule = FullScreenModule()

    init {
        reactContext.addLifecycleEventListener(this)
    }


    @ReactMethod
    fun enableFullScreen() {
        fullScreenEnabled = true
        reactContext.currentActivity?.let { fullScreenModule.enableFullScreen(it) }
    }

    @ReactMethod
    fun disableFullScreen(){
        fullScreenEnabled = false
        reactContext.currentActivity?.let { fullScreenModule.disableFullScreen(it) }
    }

    override fun onHostResume() {
       if(fullScreenEnabled){
           reactContext.currentActivity?.let { fullScreenModule.enableFullScreen(it) }
       }
    }

    override fun onHostPause() {

    }

    override fun onHostDestroy() {

    }


    companion object {
        private const val REACT_CLASS = "FullScreenModule"
    }

}