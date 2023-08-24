package com.atg.managers

import android.view.View
import com.atg.views.native_views.WebVideoView
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import timber.log.Timber


class WebVideoManager: SimpleViewManager<WebVideoView>() {
    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): WebVideoView {
        return WebVideoView(reactContext)
    }

    @ReactProp(name = "src")
    fun source(view: WebVideoView, src: String?){
        src?.let {
            Timber.tag("loadURl").d(src)
            view.loadUrl(it)
        }
    }

    @ReactProp(name = "fullScreen")
    fun enableFullScreen(view: WebVideoView, fullScreen: Boolean?) {
        if(fullScreen == true){
            view.enableFullScreen()
        } else {
            view.disableFullScreen()
        }
    }


    companion object {
        private const val REACT_CLASS = "WebVideoManager"
    }

}