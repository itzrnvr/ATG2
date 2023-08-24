package com.atg.extras.secure_player.more_controls

import android.os.Bundle
import android.view.*
import android.widget.Toast
import androidx.recyclerview.widget.LinearLayoutManager
import com.atg.extras.secure_player.FlordiaPlayer
import com.atg.databinding.PlayerControlsMoreBinding
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import timber.log.Timber

class MoreControlsDialogFragment(
    private val flordiaPlayer: FlordiaPlayer
) : BottomSheetDialogFragment() {
    private lateinit var binding: PlayerControlsMoreBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = PlayerControlsMoreBinding.inflate(layoutInflater)
        Timber.tag("tracksList").d(flordiaPlayer.currentTracksDataList.toString())

        val moreControlsAdapter = MoreControlsAdapter(flordiaPlayer.currentBitrate)

        binding.recyclerView.apply {
            adapter = moreControlsAdapter
            layoutManager = LinearLayoutManager(context)
        }

        moreControlsAdapter.differ.submitList(flordiaPlayer.currentTracksDataList)

        moreControlsAdapter.setOnItemClickListener{
            flordiaPlayer.setVideoQuality(it.bitrate)
            this.dialog?.cancel()
            this.dismiss()
            Toast.makeText(requireContext(), flordiaPlayer.currentBitrate.toString(), Toast.LENGTH_SHORT).show()
        }

        return binding.root
    }

}