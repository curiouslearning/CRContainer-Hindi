package org.curiouslearning.researchstudy.firebase;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.android.installreferrer.api.ReferrerDetails;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class AnalyticsUtils {

    private static FirebaseAnalytics mFirebaseAnalytics;
    private static final String PREFS_NAME = "InstallReferrerPrefs";
    private static final String SOURCE = "source";
    private static final String CAMPAIGN_ID = "campaign_id";

    public static FirebaseAnalytics getFirebaseAnalytics(Context context) {
        if (mFirebaseAnalytics == null) {
            mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
        }
        return mFirebaseAnalytics;
    }

    public static void logEvent(Context context, String eventName, String appName, String appUrl, String pseudoId, String language) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Bundle bundle = new Bundle();
        String source = prefs.getString(SOURCE, "");
        String campaign_id = prefs.getString(CAMPAIGN_ID, "");
        bundle.putString("web_app_title", appName);
        bundle.putString("web_app_url", appUrl);
        bundle.putString("cr_user_id", pseudoId);
        bundle.putString("cr_language", language);
        firebaseAnalytics.setUserProperty("source", source);
        firebaseAnalytics.setUserProperty("campaign_id", campaign_id);
        firebaseAnalytics.logEvent(eventName, bundle);
    }
    public static void logAttributionErrorEvent(Context context, String eventName, String appUrl, String pseudoId) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Bundle bundle = new Bundle();
        String source = prefs.getString(SOURCE, "");
        String campaign_id = prefs.getString(CAMPAIGN_ID, "");
        bundle.putString("error_type", "invalid_payload");
        bundle.putString("deep_link_uri", appUrl);
        bundle.putString("missing_key", "language");
        bundle.putString("cr_user_id", pseudoId);
        firebaseAnalytics.setUserProperty("source", source);
        firebaseAnalytics.setUserProperty("campaign_id", campaign_id);
        firebaseAnalytics.logEvent(eventName, bundle);
    }

    public static void logStartedInOfflineModeEvent(Context context, String eventName, String pseudoId) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME,
                Context.MODE_PRIVATE);
        Bundle bundle = new Bundle();
        bundle.putString("cr_user_id", pseudoId);
        String source = prefs.getString(SOURCE, "");
        String campaign_id = prefs.getString(CAMPAIGN_ID, "");
        firebaseAnalytics.setUserProperty("source", source);
        firebaseAnalytics.setUserProperty("campaign_id", campaign_id);
        firebaseAnalytics.logEvent(eventName, bundle);
    }
    public static void logLanguageSelectEvent(Context context, String eventName, String pseudoId, String language, String manifestVersion, String autoSelected) {
        FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Bundle bundle = new Bundle();
        long currentEpochTime = getCurrentEpochTime();
        bundle.putLong("event_timestamp", currentEpochTime);
        bundle.putString("cr_user_id", pseudoId);
        bundle.putString("cr_language", language);
        bundle.putString("manifest_version", manifestVersion);
        bundle.putString("auto_selected",autoSelected);
        firebaseAnalytics.setUserProperty("source", prefs.getString(SOURCE, ""));
        firebaseAnalytics.setUserProperty("campaign_id", prefs.getString(CAMPAIGN_ID, ""));
        firebaseAnalytics.logEvent(eventName, bundle);

    }



    public static void logReferrerEvent(Context context, String eventName, ReferrerDetails response) {
        if (response != null) {
            FirebaseAnalytics firebaseAnalytics = getFirebaseAnalytics(context);
            String referrerUrl = response.getInstallReferrer();
            // below one is the url for testing purpose
            // String referrerUrl = "source=facebook&utm_medium=print&campaign_id=120208084211250195&deferred_deeplink=curiousreader://app?language=nepali";
            Bundle bundle = new Bundle();
            bundle.putString("referrer_url", referrerUrl);
            bundle.putLong("referrer_click_time", response.getReferrerClickTimestampSeconds());
            bundle.putLong("app_install_time", response.getInstallBeginTimestampSeconds());

            Map<String, String> extractedParams = extractReferrerParameters(referrerUrl);
            if (extractedParams != null) {
                String source = extractedParams.get("source");
                String campaign_id = extractedParams.get("campaign_id");
                String content = extractedParams.get("content");
                bundle.putString("source", source);
                bundle.putString("campaign_id", campaign_id);
                bundle.putString("utm_content", content);
                storeReferrerParams(context, source, campaign_id);
            }

            firebaseAnalytics.logEvent(eventName, bundle);
        }
    }
    public static void storeReferrerParams(Context context, String source, String campaign_id) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(SOURCE, source);
        editor.putString(CAMPAIGN_ID, campaign_id);
        editor.apply();
    }


    private  static Map<String, String> extractReferrerParameters(String referrerUrl) {
        Map<String, String> params = new HashMap<>();
        // Using a dummy URL to ensure `Uri.parse` correctly processes the referrerUrl as part of a valid URL.
        Uri uri = Uri.parse("http://dummyurl.com/?" +referrerUrl);

        String source = uri.getQueryParameter("source");
        String campaign_id = uri.getQueryParameter("campaign_id");
        String content = uri.getQueryParameter("utm_content");
        Log.d("data without decode util", campaign_id + " " + source + " " + content);
        content = urlDecode(content);

        Log.d("referral data", uri+" "+campaign_id + " " + source + " " + content+" "+referrerUrl);

        params.put("source", source);
        params.put("campaign_id", campaign_id);
        params.put("content", content);

        return params;
    }

    public static long getCurrentEpochTime() {
        long currentTimeMillis = System.currentTimeMillis();

        return currentTimeMillis;
    }

    public static String urlDecode(String encodedString) {
        try {
            if (encodedString != null) {
                String decodedString = URLDecoder.decode(encodedString, StandardCharsets.UTF_8.toString());
                System.out.println("Decoded utm_content: " + decodedString);
                return decodedString;
            } else {
                System.out.println("Encoded string is null.");
                return null;
            }
        } catch (UnsupportedEncodingException | IllegalArgumentException e) {
            e.printStackTrace();
            return null;
        }
    }
}