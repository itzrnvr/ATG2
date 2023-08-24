import okhttp3.*
import okio.*
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

object NetworkClient {

    // Setting up a shared connection pool
    private val connectionPool = ConnectionPool(5, 1, TimeUnit.MINUTES)

    // Setting up executor service
    private val executorService = Executors.newFixedThreadPool(5)
    // Create a logging interceptor
//    private val loggingInterceptor = HttpLoggingInterceptor().apply {
//        level = HttpLoggingInterceptor.Level.BODY
//    }


    // Basic OkHttp client
    private val client: OkHttpClient = OkHttpClient.Builder()
        .connectionPool(connectionPool)
        .dispatcher(Dispatcher(executorService))
        .build()

    fun request(url: String, listener: NetworkProgressListener? = null): Call {
        val request = Request.Builder()
            .url(url)
            .tag(listener)
            .build()

        val builder = client.newBuilder()

        listener?.let {
            builder
                .addNetworkInterceptor(InterceptProgress(it))  // add the interceptor only if listener is not null
                .build()
        }

        return builder.build()
            .newCall(request)
    }
}

private class InterceptProgress(private val listener: NetworkProgressListener) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalResponse = chain.proceed(chain.request())
        return originalResponse.newBuilder()
            .body(ProgressResponseBody(originalResponse.body!!, listener))
            .build()
    }
}

interface NetworkProgressListener {
    fun update(bytesRead: Long, contentLength: Long, done: Boolean, percentage: Int)
}

class ProgressResponseBody(
    private val responseBody: ResponseBody,
    private val progressListener: NetworkProgressListener?
) : ResponseBody() {

    private var bufferedSource: BufferedSource? = null

    override fun contentType(): MediaType? {
        return responseBody.contentType()
    }

    override fun contentLength(): Long {
        return responseBody.contentLength()
    }

    override fun source(): BufferedSource {
        if (bufferedSource == null) {
            bufferedSource = source(responseBody.source()).buffer()
        }
        return bufferedSource!!
    }

    private fun source(source: Source): Source {
        return object : ForwardingSource(source) {
            var totalBytesRead = 0L

            override fun read(sink: Buffer, byteCount: Long): Long {
                val bytesRead = super.read(sink, byteCount)
                totalBytesRead += if (bytesRead != -1L) bytesRead else 0

                val percentage = (100 * totalBytesRead / responseBody.contentLength()).toInt()
                progressListener?.update(totalBytesRead, responseBody.contentLength(), bytesRead == -1L, percentage)

                return bytesRead
            }
        }
    }
}

