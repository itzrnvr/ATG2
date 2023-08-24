package com.atg.utils

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.koushikdutta.async.http.server.AsyncHttpServer
import com.koushikdutta.async.http.server.AsyncHttpServerRequest
import com.koushikdutta.async.http.server.AsyncHttpServerResponse
import java.net.URI

sealed class TaskResult<out T> {

    object Loading : TaskResult<Nothing>()

    data class Success<out T>(val data: T) : TaskResult<T>()

    data class Error(val message: String, val error: Exception) : TaskResult<Nothing>()

}

sealed class PlayList {
    data class MasterPlaylist(val data: String, val url: String) : PlayList()
    data class VariantPlaylist(val data: String, val url: String) : PlayList()
    object InvalidPlaylist: PlayList()
}

fun String.getParentUrl(): String? {
    val uri = URI(this)
    return if (uri.path == null || uri.path.trim().isEmpty() || uri.path.trim() == "/") {
        this
    } else {
        // Create new URI with stripped path
        val parentUri = URI(uri.scheme, uri.userInfo, uri.host, uri.port, uri.path.substringBeforeLast("/"), uri.query,
            uri.fragment)
        parentUri.toString()
    }
}

fun String.removeFirstSlash(): String {
    return if (startsWith("/")) substring(1) else this
}

data class Stream(
    val steamName: String,
    val streamID: String,
    val streamBasePath: String,
)

data class StreamSegment(
    val streamID: String,
    val segmentName: String,
    val segmentPath: String
)

fun <T> T.encodeToString(): String {
    val gson = Gson()
    return gson.toJson(this)
}

inline fun <reified T> String.decodeFromString(): T {
    val gson = Gson()
    val type = object : TypeToken<T>() {}.type
    return gson.fromJson(this, type)
}



