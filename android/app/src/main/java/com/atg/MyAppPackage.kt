package com.atg

import com.atg.managers.FullScreenManager
import com.atg.managers.LocalServerManager
import com.atg.managers.SecurePlayerManager
import com.atg.managers.StreamDownloaderManager
import com.atg.managers.WebVideoManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext

class MyAppPackage() : ReactPackage {
    override fun createNativeModules(reactApplicationContext: ReactApplicationContext): MutableList<NativeModule> {
       return listOf(
           StreamDownloaderManager(reactApplicationContext),
           LocalServerManager(reactApplicationContext),
           FullScreenManager(reactApplicationContext)
       ).toMutableList()
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ) = listOf(WebVideoManager())

}