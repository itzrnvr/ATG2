package com.atg.managers

import android.view.MotionEvent
import com.atg.extras.secure_player.SecurePlayer
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.google.android.exoplayer2.ui.PlayerView
import timber.log.Timber


class SecurePlayerManager(
    private val reactContext: ReactApplicationContext
) : SimpleViewManager<PlayerView>(), LifecycleEventListener {

    private lateinit var playerView: PlayerView

    companion object {
        private const val REACT_CLASS = "SecurePlayerManager"
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): PlayerView {
        playerView = object : PlayerView(reactContext) {
            override fun onTouchEvent(ev: MotionEvent): Boolean {
                return false
            }

            override fun onTrackballEvent(ev: MotionEvent): Boolean {
                return false
            }
        }
        playerView.useController = false

        // Add lifecycle event listener
        reactContext.addLifecycleEventListener(this)

        return playerView
    }

    @ReactProp(name = "source")
    fun setSource(playerView: PlayerView, source: String) {
        SecurePlayer.playVideo(source, playerView)
    }

    override fun receiveCommand(playerView: PlayerView, commandId: Int, args: ReadableArray?) {
        when (commandId) {
            1 -> SecurePlayer.resume(SecurePlayer.getCurrentPlayerPosition() ?: 0L)
            2 -> {
                SecurePlayer.pause()
                Timber.tag("RECEIVE_COMMAND").d("PAUSE EXECUTED")
            }
        }
    }

    override fun onHostPause() {
        SecurePlayer.stop()
    }

    override fun onHostResume() {
        SecurePlayer.resume(SecurePlayer.getCurrentPlayerPosition() ?: 0L)
    }

    override fun onHostDestroy() {
        SecurePlayer.release()
    }

    override fun getCommandsMap(): Map<String, Int> {
        return hashMapOf("play" to 1, "pause" to 2)
    }
}
