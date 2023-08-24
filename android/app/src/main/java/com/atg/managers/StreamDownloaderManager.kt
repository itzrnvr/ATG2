package com.atg.managers

import android.util.Log
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.lifecycle.lifecycleScope
import com.atg.native_modules.downloader.DownloadListener
import com.atg.native_modules.downloader.HlsDownloader
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.Exception

class StreamDownloaderManager(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext)  {
    override fun getName(): String {
        return REACT_CLASS
    }

    private val downloader = HlsDownloader(reactContext, ProcessLifecycleOwner.get().lifecycleScope)

    private fun sendProgressUpdateEvent(url: String, progress: Float) {
        val params: WritableMap = Arguments.createMap()
        params.putString("progress", progress.toString())
        params.putString("url", url)
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("onDownloadProgress", params)
    }

    @ReactMethod
    fun download(url: String){
        Log.d("Downloading", "started")
        downloader.download(url, object : DownloadListener {

            override fun onDownloadStarted(url: String) {

            }

            override fun onDownloadProgress(progress: Float) {
                Log.d("Downloading", "progress: ${progress}%")
                sendProgressUpdateEvent(url, progress)
            }

            override fun onDownloadCancelled(
                url: String,
                progress: Float,
                bytesDownloaded: ByteArray?
            ) {

            }

            override fun onDownloadError(e: Exception, message: String) {

            }

        })
    }

    companion object {
        private const val REACT_CLASS = "StreamDownloaderModule"
    }
}