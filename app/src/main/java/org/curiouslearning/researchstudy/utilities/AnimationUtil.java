package org.curiouslearning.researchstudy.utilities;

import android.view.View;

public class AnimationUtil {

    public static void scaleButton(final View view, final Runnable endAction) {
        view.animate()
                .scaleX(1.2f)
                .scaleY(1.2f)
                .setDuration(100)  // Increased duration for a smoother effect, you can adjust as needed
                .withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        view.animate()
                                .scaleX(1.0f)
                                .scaleY(1.0f)
                                .setDuration(100)  // Increased duration for a smoother effect, you can adjust as needed
                                .withEndAction(new Runnable() {
                                    @Override
                                    public void run() {
                                        if (endAction != null) {
                                            endAction.run();
                                        }
                                    }
                                })
                                .start();
                    }
                })
                .start();
    }
}
