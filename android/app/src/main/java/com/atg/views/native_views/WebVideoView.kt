package com.atg.views.native_views

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.os.Build
import android.view.View
import android.view.Window
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.webkit.*
import com.facebook.react.uimanager.ThemedReactContext
import kotlinx.coroutines.*
import okhttp3.OkHttpClient
import okhttp3.Request
import timber.log.Timber
import java.io.ByteArrayInputStream
import java.io.IOException

@SuppressLint("SetJavaScriptEnabled")
class WebVideoView(private val reactContext: ThemedReactContext) : WebView(reactContext) {
    private val httpClient = OkHttpClient()
    private val scope = CoroutineScope(Dispatchers.IO)

//    https://junglebookpune.org/test_awaken_genius/videos/speed_reading/master.m3u8
//    1) CP8S-WI61-7CHJ-LXMP
//    2) KBH7-2ZBI-5AHI-DCQD
//    3) WL3J-H5LU-HRPI-SQNP

    init {
        setupWebView()
        enableFullScreen()
//        loadUrl("https://vimejs.com/demo")
        loadUrl("file:///android_asset/html/player/player.html")
    }

    private fun setupWebView() {
        webViewClient = createWebViewClient()
        webChromeClient = WebChromeClient()

        settings.apply {
            allowContentAccess = true
            domStorageEnabled = true
            javaScriptEnabled = true
            javaScriptCanOpenWindowsAutomatically = true
            pluginState = WebSettings.PluginState.ON
            mediaPlaybackRequiresUserGesture = false
        }
    }

    private fun createWebViewClient() = object : WebViewClient() {
        override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
            return if (request.url.toString().startsWith("http") || request.url.toString().startsWith("https")) {
                fetchWebResource(request)
            } else {
                super.shouldInterceptRequest(view, request)
            }
            //return super.shouldInterceptRequest(view, request)
        }
    }

    private fun fetchWebResource(request: WebResourceRequest): WebResourceResponse? {
        var bodyData: ByteArray? = null
        var headersMap: Map<String, String>? = null

        val httpRequest = Request.Builder()
            .url(request.url.toString())
            .build()

        scope.launch {
            try {
                val response = httpClient.newCall(httpRequest).execute()

                if (response.isSuccessful) {
                    withContext(Dispatchers.IO){
                        headersMap = response.headers.toMultimap().mapValues { it.value.joinToString() }
                        bodyData = response.body?.bytes()
                    }
                } else {
                    throw IOException("Error response " + response.code)
                }

            } catch (e: Exception) {
                Timber.e(e, "Failed to make request")
            }
        }

        logResponseBody(request, bodyData)

        return bodyData?.let { data ->
            WebResourceResponse(
                null,
                "UTF-8",
                ByteArrayInputStream(data)
            ).apply {
                responseHeaders = headersMap
            }
        }
    }

    private fun logResponseBody(request: WebResourceRequest, bodyData: ByteArray?) {
        bodyData?.let { data ->
            val responseBody = String(data)
            if(request.url.toString().contains("localhost")){
                Timber.tag("ResponseUrl: ").d(request.url.toString())
                Timber.tag("Response: ").d(responseBody)
            }
        }
    }

    fun cleanup() {
        scope.cancel()
    }


    fun enableFullScreen() {
        fullScreenActivity(reactContext.currentActivity?.window)
    }

    fun disableFullScreen() {
        reactContext.currentActivity?.window?.let { notFullScreen(it) }
    }

    private fun fullScreenActivity(window: Window?) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window?.setDecorFitsSystemWindows(false)
            val controller =  window?.insetsController
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                controller.systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    window.attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                };
            }
        } else {
            window?.decorView?.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN)
            window?.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
            window?.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                window?.attributes?.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            };
        }
    }
    private fun notFullScreen(window: Window){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(true)
            val controller =  window.insetsController
            if (controller != null) {
                controller.show(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                controller.systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_DEFAULT
                window.attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER;
            }
        } else {
            window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_VISIBLE)
            window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                window.attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER
            };
        }

    }
}
