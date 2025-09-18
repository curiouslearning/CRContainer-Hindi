// File: src/main/java/org/curiouslearning/container/utilities/AudioPlayer.java

package org.curiouslearning.researchstudy.utilities;

import android.content.Context;
import android.media.MediaPlayer;
import android.util.Log;

public class AudioPlayer {

    private static final String TAG = "AudioPlayer";
    private MediaPlayer mediaPlayer;

    public void play(Context context, int soundResourceId) {
        try {
            if (mediaPlayer != null) {
                mediaPlayer.release();
            }
            mediaPlayer = MediaPlayer.create(context, soundResourceId);
            mediaPlayer.setOnCompletionListener(mp -> mp.release());
            mediaPlayer.start();
        } catch (Exception e) {
            Log.e(TAG, "Error playing sound: " + e.getMessage(), e);
        }
    }
    public void stop() {
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }
}
