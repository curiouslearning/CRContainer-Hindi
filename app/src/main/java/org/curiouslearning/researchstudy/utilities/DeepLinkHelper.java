package org.curiouslearning.researchstudy.utilities;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import org.curiouslearning.researchstudy.MainActivity;

public class DeepLinkHelper {
    private static final String TAG = "DeepLinkHelper";
    public static String handleDeepLink(Activity activity, Intent intent) {
        Log.d(TAG, "handleDeepLink: Received intent: " + intent);
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            Log.d(TAG, "handleDeepLink: Action is VIEW");
            Uri uri = intent.getData();
            Log.d(TAG, "handleDeepLink: URI: " + uri);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            String pathPrefix = uri.getPath();

            Log.d(TAG, "handleDeepLink: Scheme: " + scheme);
            Log.d(TAG, "handleDeepLink: Host: " + host);
            Log.d(TAG, "handleDeepLink: Path prefix: " + pathPrefix);
            if (scheme != null && scheme.equals("curiousreader")
                    && host != null && host.equals("app")
                    && pathPrefix != null && pathPrefix.startsWith("/language")) {
                Log.d(TAG, "handleDeepLink: Valid deep link URI");
                String language = pathPrefix.substring("/language=".length());
                Log.d(TAG, "handleDeepLink: Extracted language: " + language);
                Intent mainIntent = new Intent(activity, MainActivity.class);
                mainIntent.putExtra("language", language);
                activity.startActivity(mainIntent);
                return language;
            }
        }
        Log.d(TAG, "handleDeepLink: Redirecting to Play Store");
        redirectToPlayStore(activity);
        return "";
    }

    private static void redirectToPlayStore(Activity activity) {
        Log.d(TAG, "redirectToPlayStore: Redirecting to Play Store");
        Intent marketIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=org.curiouslearning.container"));
        activity.startActivity(marketIntent);
    }
}

