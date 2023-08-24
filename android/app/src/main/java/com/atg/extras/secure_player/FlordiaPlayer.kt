package com.atg.extras.secure_player

import android.content.Context
import android.media.MediaFormat
import com.google.android.exoplayer2.*
import com.google.android.exoplayer2.ext.okhttp.OkHttpDataSource
import com.google.android.exoplayer2.source.MediaSource
import com.google.android.exoplayer2.source.hls.HlsMediaSource
import com.google.android.exoplayer2.ui.PlayerView
import com.google.android.exoplayer2.upstream.cache.CacheDataSource
import com.google.android.exoplayer2.video.VideoFrameMetadataListener
import okhttp3.OkHttpClient
import timber.log.Timber

object FlordiaPlayer {
    var player: ExoPlayer? = null
    var currentUrl: String? = null

    val currentBitrate: Int?
        get() = player?.videoFormat?.bitrate

    val currentTracksDataList = ArrayList<TrackData>()
    var cacheDataSourceFactory: CacheDataSource.Factory? = null

    init {
        Timber.tag("FlordiaPlayerInitialized").d("BRUH")
    }

    fun playVideo(url: String, playerView: PlayerView){
        currentUrl = url
        player = makePlayer(playerView.context)
        playerView.player = player
        player?.setMediaSource(createMediaSource(url))
        player?.prepare()
        player?.play()
        listen()
    }

    fun getCurrentPlayerPosition(): Long? = player?.currentPosition

    private fun listen(){
        player?.addListener(object: Player.Listener{
            override fun onTracksInfoChanged(tracksInfo: TracksInfo) {
                super.onTracksInfoChanged(tracksInfo)

                val tracks = tracksInfo.trackGroupInfos.firstOrNull()

                tracks?.let {
                    for(i in 0 until tracks.trackGroup.length){
                        val data = TrackData(
                            "${tracks.trackGroup.getFormat(i).width} x ${tracks.trackGroup.getFormat(i).height}",
                            tracks.trackGroup.getFormat(i).bitrate
                        )
                        if(!currentTracksDataList.contains(data))
                            currentTracksDataList.add(data)
                    }
                }
            }
        })
    }

    fun setVideoQuality(bitrate: Int){
        player?.let{
            it.trackSelectionParameters = it.trackSelectionParameters
                .buildUpon()
                .setMaxVideoBitrate(bitrate)
                .setMinVideoBitrate(bitrate)
                .build()

            Timber.tag("setVidQual").d(bitrate.toString())

            it.setVideoFrameMetadataListener(object : VideoFrameMetadataListener {
                override fun onVideoFrameAboutToBeRendered(
                    presentationTimeUs: Long,
                    releaseTimeNs: Long,
                    format: Format,
                    mediaFormat: MediaFormat?
                ) {
                    Timber.d("""
                                         ${format.height} x ${format.width}
                                         ${format.bitrate}
                                         """.trimIndent())
                }
            })

        }
    }

    fun resume(pos: Long) {
        player?.seekTo(pos)
        player?.prepare()
        player?.play()
    }

    fun stop(): Long? {
        val currentPos = getCurrentPlayerPosition()
        player?.stop()
        return currentPos
    }
    fun release(): Long? {
        val currentPos = getCurrentPlayerPosition()
        player?.stop()
        player?.release()
        player = null

        return currentPos
    }

    private fun createMediaSource(hls: String): MediaSource {

        val dataSourceFactory = OkHttpDataSource.Factory(OkHttpClient.Builder().build())
        val hlsMediaSource = if(cacheDataSourceFactory != null){
            HlsMediaSource.Factory(cacheDataSourceFactory!!)
                .setAllowChunklessPreparation(false)
                .createMediaSource(MediaItem.fromUri(hls))
        } else {
            HlsMediaSource.Factory(dataSourceFactory)
                .setAllowChunklessPreparation(false)
                .createMediaSource(MediaItem.fromUri(hls))
        }

        return hlsMediaSource
    }

    private fun makePlayer(context: Context): ExoPlayer {
        Timber.d("shit this got called again bruh")
        return player ?: ExoPlayer.Builder(context).build()
    }
}

//data class TrackData(
//    val quality: String,
//    val bitrate: Int
//)
