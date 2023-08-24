package com.atg.native_modules.downloader

import com.google.android.material.transition.MaterialContainerTransform.ProgressThresholds
import okhttp3.OkHttpClient
import java.lang.Exception

interface DownloadListener {
    fun onDownloadStarted(url: String)
    fun onDownloadProgress(progress: Float)
    fun onDownloadCancelled(url: String, progress: Float, bytesDownloaded: ByteArray?)
    fun onDownloadError(e: Exception, message: String)
}