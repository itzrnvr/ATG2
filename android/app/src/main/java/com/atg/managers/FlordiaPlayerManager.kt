package com.atg.managers

import com.anatame.flordia.presentation.widgets.flordia_player.FlordiaPlayerSystem
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class FlordiaPlayerManager : SimpleViewManager<FlordiaPlayerSystem>() {

    override fun getName(): String {
        return "FlordiaPlayer"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): FlordiaPlayerSystem {
        return FlordiaPlayerSystem(reactContext)
    }

    @ReactProp(name = "url")
    fun setUrl(view: FlordiaPlayerSystem, url: String) {
        view.playVideo(url, null)
    }
}