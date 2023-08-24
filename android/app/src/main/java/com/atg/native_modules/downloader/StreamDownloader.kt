package com.atg.native_modules.downloader

import java.io.File

interface StreamDownloader {
    fun download(
        url: String,
        listener: DownloadListener?
    ): File?
}

