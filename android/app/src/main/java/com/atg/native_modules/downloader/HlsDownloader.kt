package com.atg.native_modules.downloader

import NetworkClient
import NetworkProgressListener
import android.content.Context
import androidx.lifecycle.LifecycleCoroutineScope
import com.atg.utils.PlayList
import com.atg.utils.TaskResult
import com.atg.utils.getParentUrl
import io.lindstrom.m3u8.model.MasterPlaylist
import io.lindstrom.m3u8.model.MediaPlaylist
import io.lindstrom.m3u8.model.Variant
import io.lindstrom.m3u8.parser.MasterPlaylistParser
import io.lindstrom.m3u8.parser.MediaPlaylistParser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import okhttp3.Call
import okhttp3.Callback
import okhttp3.Request
import okhttp3.Response
import okio.BufferedSink
import okio.buffer
import okio.sink
import timber.log.Timber
import java.io.File
import java.io.IOException
import java.util.concurrent.atomic.AtomicLong


class HlsDownloader(
    private val context: Context,
    private val lifecycleCoroutineScope: LifecycleCoroutineScope
): StreamDownloader {
    private lateinit var url: String

    private var streamDownloadListener: DownloadListener? = null

    override fun download(url: String, listener: DownloadListener?): File? {
        Timber.tag("heollo").d("startedlool")
        this.url = url
        this.streamDownloadListener = listener


        lifecycleCoroutineScope.launch {
            runBlocking(Dispatchers.IO) {
                streamDownloadListener?.onDownloadStarted(url)
                fetchPlayList(url){response ->
                    when(response) {
                        is TaskResult.Success -> {
                            when(response.data){
                                is PlayList.MasterPlaylist -> {
                                    Timber.d("MasterPlaylist", response.data.data)
                                    handleMasterPlaylist(response.data.data)
                                }
                                is PlayList.VariantPlaylist -> {
                                    Timber.d("VariantPlaylist", response.data.data)
                                }
                                is PlayList.InvalidPlaylist ->{
                                    Timber.d("INVALID PLAYLIST")
                                }
                            }
                        }
                        else -> {}
                    }
                }
            }
        }
        return null
    }

    private fun handleMasterPlaylist(masterPlaylistString: String) {
        val parser = MasterPlaylistParser()
        val masterPlaylist = parser.readPlaylist(masterPlaylistString)
        val streamName = "StreamOne"
        val streamDir = getStreamDir(streamName)
        val variantList = ArrayList<Variant>()

        variantList.addAll(masterPlaylist.variants())

        val newMasterPlaylist = MasterPlaylist.Builder()
            .version(masterPlaylist.version())


        variantList.forEachIndexed { index, readVariant ->
            (fetchPlayList(readVariant.uri().toString()){response ->
                when(response){
                    is TaskResult.Error -> {}
                    TaskResult.Loading -> {}
                    is TaskResult.Success -> {
                        when(val playList = response.data){
                            is PlayList.VariantPlaylist -> { playList.data
                                val variantDir = getStreamDir(streamName, "variant-${index}")
                                Timber.tag("writingStreamMaster").d(variantDir.absolutePath)
                                fetchAndSaveSegments(playList.data, playList.url, variantDir)
                                newMasterPlaylist.addVariants(
                                    Variant.Builder()
                                        .from(readVariant)
                                        .addAllCodecs(readVariant.codecs())
                                        .uri("variant-${index}/playlist.m3u8")
                                        .build()
                                )
                            }
                            else -> {}
                        }
                    }
                }
            })
        }
    }




    private fun fetchAndSaveSegments(variantPlaylistData: String, baseUrl: String, variantDir: File){
        Timber.tag("variant").d(variantPlaylistData)
        val segmentUriList = ArrayList<Pair<String, String>>()

        val parser = MediaPlaylistParser()
        val parserRead = parser.readPlaylist(variantPlaylistData)

        val newMediaPlaylist = MediaPlaylist.Builder().from(parserRead)

        parserRead.mediaSegments().forEach {mediaSegment ->

            mediaSegment.uri()?.let {uri ->
                val finalSegmentUrl = "${baseUrl.getParentUrl()}/$uri"
                Timber.tag("segmentURl").d(finalSegmentUrl)
                segmentUriList.add(Pair(finalSegmentUrl, mediaSegment.uri()))
            }
        }
        downloadFiles(segmentUriList, variantDir) { progress ->
            streamDownloadListener?.onDownloadProgress(progress)
        }

        writeToFile(variantDir, "playlist.m3u8", parser.writePlaylistAsBytes(newMediaPlaylist.build()))
    }

    private fun downloadFiles(fileData: List<Pair<String, String>>,  saveDir: File, listener: (progress: Float) -> Unit) {
        val completedLength = AtomicLong(0L)
        val totalLength = AtomicLong(0L)

        // Download in parallel using kotlinx.coroutines
        CoroutineScope(Dispatchers.IO).launch {
            val deferredDownloads = fileData.map { (url, name) ->
                async {
                    downloadBinary(
                        url,
                        name,
                        saveDir
                    ) { bytesRead, contentLength, done, percentage ->
                        completedLength.addAndGet(bytesRead)
                        totalLength.addAndGet(contentLength)

                        if (done) {
                            val totalProgress = (completedLength.get() * 100f) / totalLength.get()
                            listener(totalProgress)
                        }
                    }
                }
            }
            deferredDownloads.awaitAll()
        }
    }

    private fun downloadBinary(url: String, fileName: String, saveDir: File, progressListener: (Long, Long, Boolean, Int) -> Unit) {
        val networkCall = NetworkClient.request(url, object : NetworkProgressListener {
            override fun update(bytesRead: Long, contentLength: Long, done: Boolean, percentage: Int) {
                progressListener(bytesRead, contentLength, done, percentage)
                Timber.tag("SegmentDownload").d("Progress: $percentage% $contentLength, $bytesRead, $done")
            }
        })

        networkCall.enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Timber.tag("DownloadingSegment").e(e, "BRUH")
                Timber.tag("DownloadingSegment").e(e, url)
            }

            override fun onResponse(call: Call, response: Response) {
                Timber.tag("DownloadingSegment").d(url)
                val downloadFile = File(saveDir, fileName)
                val sink: BufferedSink = downloadFile.sink().buffer()
                sink.writeAll(response.body.source())
                sink.close()
            }
        })
    }


    private fun writeToFile(dir: File, fileName: String, byteArray: ByteArray): File? {
        val file = File(dir, fileName)
        return try {
            // readingFilesFromPath(file.absolutePath)   // removed this line as its implementation is not included
            file.writeBytes(byteArray)
            println("Byte array written to file successfully")
            file
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }


    private fun fetchPlayList(url: String, response: (TaskResult<PlayList>) -> Unit) {
        Timber.tag("fullmasterUrl").d(url)
        val request = Request.Builder().url(url).build()
        var playlist: PlayList? = null
        makeRequest(request){result ->
            when (result) {
                is TaskResult.Success -> response(TaskResult.Success(determinePlaylistType(result.data, url)))
                is TaskResult.Error -> {
                    response(TaskResult.Error(result.message, result.error))
                    streamDownloadListener?.onDownloadError(result.error, result.message)
                }
                is TaskResult.Loading -> {response(TaskResult.Loading)}
            }
        }
    }

    private fun determinePlaylistType(playListString: String, url: String): PlayList {
        Timber.tag("determinePlaylistType").d(playListString)
        return if(playListString.contains("#EXT-X-STREAM-INF")){
            PlayList.MasterPlaylist(playListString, url)
        } else if (!playListString.contains("#EXT-X-STREAM-INF") && playListString.contains("#EXTINF")){
            PlayList.VariantPlaylist(playListString, url)
        } else {
            PlayList.InvalidPlaylist
        }
    }


    private fun makeRequest(request: Request, response: (TaskResult<String>) -> Unit) {
        response(TaskResult.Loading)
        val call = NetworkClient.request(request.url.toString())
        call.enqueue(object : Callback{
            override fun onResponse(call: Call, networkResponse: Response) {
                if (!networkResponse.isSuccessful) throw java.io.IOException("Unexpected code $networkResponse")
                val responseString = networkResponse.body?.string().toString()
                Timber.tag("NetworkSuccess").d(responseString)
                response(TaskResult.Success(responseString))
            }

            override fun onFailure(call: Call, e: okio.IOException) {
                Timber.tag("NetworkError").e(e)
                response(TaskResult.Error("NetworkError", e))
            }
        })
    }

    private fun getStreamDir(streamName: String, variantName: String? = null): File {

        val offlineStreamsDir= File(context.cacheDir, "offlineVideos")
        if (!offlineStreamsDir.exists()) {
            offlineStreamsDir.mkdirs()
        }

        //val offlineContentDir = File(context.filesDir, "offline_content")

        // Create a directory for the current HLS stream inside offline_content.
        val currentStreamDir = File(offlineStreamsDir, streamName)
        if (!currentStreamDir.exists()) {
            currentStreamDir.mkdirs()
        }

        val currentStreamVariantDir = variantName?.let { File(currentStreamDir, it) }
        currentStreamVariantDir?.let{
            if (!it.exists()) {
                it.mkdirs()
            }
        }


        return currentStreamVariantDir ?: currentStreamDir
    }
}