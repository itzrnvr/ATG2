package com.example.secure_exoplayer

import NetworkClient
import android.content.Context
import com.atg.utils.removeFirstSlash
import com.koushikdutta.async.AsyncServerSocket
import com.koushikdutta.async.http.server.AsyncHttpServer
import com.koushikdutta.async.http.server.AsyncHttpServerRequest
import com.koushikdutta.async.http.server.AsyncHttpServerResponse
import com.koushikdutta.async.http.server.HttpServerRequestCallback
import okhttp3.Call
import okhttp3.Callback
import okhttp3.Response
import okio.IOException
import timber.log.Timber
import java.io.File
import java.util.TimerTask


class AndroidAsyncServer(private val context: Context) {

    companion object {
        private const val LOG_TAG = "AndroidAsyncServer"
    }

    private var PORT = 7071
    private var serveDirPath: String? = null
    private val server: AsyncHttpServer = createServer()

    private fun createServer() = object : AsyncHttpServer() {
        override fun onRequest(request: AsyncHttpServerRequest?, response: AsyncHttpServerResponse?) =
            handleRequest(request, response)
    }

    private fun handleRequest(request: AsyncHttpServerRequest?, response: AsyncHttpServerResponse?): Boolean {
        response?.headers?.add("Access-Control-Allow-Origin", "*")
        response?.headers?.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD")

        val path = request?.path?.removeFirstSlash()

        return when {
            request == null || path == null -> {
                Timber.tag(LOG_TAG).d("Invalid request or missing file path.")
                response?.code(400)
                false
            }
            path == "/" -> handleBasePath(response)
            path == "ping" -> handlePing(response)
            path.startsWith("static/assets") -> handleAssetRequest(path, response)
            else -> handleFileRequest(path, response)
        }
    }

    private fun handleBasePath(response: AsyncHttpServerResponse?): Boolean {
        response?.send("Server is running, this is the basepath")
        response?.code(200)
        return true
    }

    private fun handlePing(response: AsyncHttpServerResponse?): Boolean {
        response?.send("Server is running")
        response?.code(200)
        return true
    }

    private fun handleAssetRequest(path: String, response: AsyncHttpServerResponse?): Boolean {
        val assetPath = path.removePrefix("static/assets/")
        return try {
            val assetManager = context.assets
            val assetInputStream = assetManager.open(assetPath)
            response?.sendStream(assetInputStream, assetInputStream.available().toLong())
            response?.code(200)
            true
        } catch (e: IOException) {
            Timber.tag(LOG_TAG).e(e, "Asset not found: $assetPath")
            response?.code(404)
            false
        }
    }

    private fun handleFileRequest(path: String, response: AsyncHttpServerResponse?): Boolean {
        val file = File(serveDirPath, path)
        return if (file.exists()) {
            Timber.tag(LOG_TAG).d("File exists: ${file.name}")
            when (file.extension) {
                "ts" -> response?.headers?.add("Content-Type", "video/MP2T")
                "m3u8" -> response?.headers?.add("Content-Type", "application/x-mpegURL")
                else -> Timber.tag(LOG_TAG).d("Uncategorized file type: ${file.extension}")
            }
            response?.sendStream(file.inputStream(), file.length())
            response?.code(200)
            true
        } else {
            Timber.tag(LOG_TAG).d("Requested file not found.")
            response?.code(404)
            false
        }
    }

    fun setPort(port: Int){
        this.PORT = port
    }

    fun startServer(serveDirPath: String, callback: (status: Boolean, url: String) -> Unit){
        this.serveDirPath = serveDirPath
        checkServerIsRunning {status ->
            if(!status) {
                try {
                    server.listen(PORT)
                    callback(true, "http://localhost:${PORT}")
                } catch (e: Exception){
                    e.printStackTrace()
                    callback(false, "")
                }
            } else {
                callback(true, "http://localhost:${PORT}")
            }
        }
    }


    private fun checkServerIsRunning(callback: (Boolean) -> Unit){
        isRunning("http://localhost:${PORT}/ping"){
            callback(it)
        }
    }

    private fun isRunning(url: String, callback: (Boolean) -> Unit){
        NetworkClient.request(url).enqueue(object : Callback{
            override fun onFailure(call: Call, e: IOException) {
                callback(false)
            }

            override fun onResponse(call: Call, response: Response) {
                callback(response.isSuccessful)
            }
        })
    }


    fun stop() {
        server.stop()
    }
}