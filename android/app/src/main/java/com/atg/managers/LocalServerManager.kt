package com.atg.managers


import com.example.secure_exoplayer.AndroidAsyncServer
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import timber.log.Timber

class LocalServerManager(
    private val reactContext: ReactApplicationContext
): ReactContextBaseJavaModule(reactContext), LifecycleEventListener {
    override fun getName() = REACT_CLASS
    private val serveDirPath = "${reactContext.cacheDir}/offlineVideos"
    private val server = AndroidAsyncServer(reactContext)
    private var startServerPromise: Promise? = null


    init {
        reactContext.addLifecycleEventListener(this)
    }


    @ReactMethod
    fun startServer(promise: Promise?) {
        startServerPromise = promise
        server.startServer(serveDirPath) {status, url ->
            Timber.tag("ServerStatus").d("running on url: $url")
            // Here status and url are being passed back
            if(status) {
                startServerPromise?.resolve(url)
            } else {
                startServerPromise?.reject("ERROR", "Something went wrong");
            }
        }
    }

    @ReactMethod
    fun stopServer(){
        server.stop()
    }

    override fun onHostResume() {
      startServer(startServerPromise)
    }

    override fun onHostPause() {
        stopServer()
    }

    override fun onHostDestroy() {
        stopServer()
    }


    companion object {
        private const val REACT_CLASS = "LocalServerModule"
    }

}