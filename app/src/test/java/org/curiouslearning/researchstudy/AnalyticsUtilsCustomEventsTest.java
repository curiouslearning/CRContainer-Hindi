
package org.curiouslearning.researchstudy;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import com.google.firebase.analytics.FirebaseAnalytics;

import org.curiouslearning.researchstudy.firebase.AnalyticsUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.lang.reflect.Field;

import static androidx.test.core.app.ApplicationProvider.getApplicationContext;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 28)
public class AnalyticsUtilsCustomEventsTest {

    private Context context;
    private SharedPreferences prefs;

    @Before
    public void setup() throws Exception {
        // Get a proper Android Context under Robolectric
        context = getApplicationContext();

        // Initialize SharedPreferences so AnalyticsUtils can read them
        prefs = context.getSharedPreferences("InstallReferrerPrefs", Context.MODE_PRIVATE);
        prefs.edit()
                .putString("source", "test_source")
                .putString("campaign_id", "test_campaign")
                .apply();

        // **Reset the cached FirebaseAnalytics** so our static mock takes effect
        Field mFaField = AnalyticsUtils.class.getDeclaredField("mFirebaseAnalytics");
        mFaField.setAccessible(true);
        mFaField.set(null, null);
    }

    @Test
    public void testLogEvent_appLaunch() {
        // Prepare a spy for FirebaseAnalytics
        FirebaseAnalytics spyFA = Mockito.spy(FirebaseAnalytics.getInstance(context));

        // Mock the static factory
        try (MockedStatic<FirebaseAnalytics> faStatic = Mockito.mockStatic(FirebaseAnalytics.class)) {
            faStatic.when(() -> FirebaseAnalytics.getInstance(context)).thenReturn(spyFA);

            // Call the method under test
            AnalyticsUtils.logEvent(
                    context,
                    "app_launch",
                    "Feed the Monster",
                    "https://example.com/ftm",
                    "user123",
                    "Hindi"
            );

            // Capture and assert the Bundle passed
            ArgumentCaptor<Bundle> captor = ArgumentCaptor.forClass(Bundle.class);
            verify(spyFA).logEvent(eq("app_launch"), captor.capture());
            Bundle b = captor.getValue();
            assertEquals("Feed the Monster", b.getString("web_app_title"));
            assertEquals("https://example.com/ftm", b.getString("web_app_url"));
            assertEquals("user123", b.getString("cr_user_id"));
            assertEquals("Hindi", b.getString("cr_language"));

            // Verify user properties on the same instance
            verify(spyFA).setUserProperty("source", "test_source");
            verify(spyFA).setUserProperty("campaign_id", "test_campaign");
        }
    }

    @Test
    public void testLogLanguageSelectEvent() {
        // Again, spy and reset static factory
        FirebaseAnalytics spyFA = Mockito.spy(FirebaseAnalytics.getInstance(context));
        try (MockedStatic<FirebaseAnalytics> faStatic = Mockito.mockStatic(FirebaseAnalytics.class)) {
            faStatic.when(() -> FirebaseAnalytics.getInstance(context)).thenReturn(spyFA);

            // Call the language‐select method
            AnalyticsUtils.logLanguageSelectEvent(
                    context,
                    "language_selected",
                    "user456",
                    "Nepali",
                    "v1.2.3",
                    "false"
            );

            // Capture and assert that logEvent was called
            ArgumentCaptor<Bundle> captor = ArgumentCaptor.forClass(Bundle.class);
            verify(spyFA).logEvent(eq("language_selected"), captor.capture());
            Bundle b = captor.getValue();
            assertEquals("user456", b.getString("cr_user_id"));
            assertEquals("Nepali", b.getString("cr_language"));
            assertEquals("v1.2.3", b.getString("manifest_version"));
            assertEquals("false", b.getString("auto_selected"));

            // Verify user properties too
            verify(spyFA).setUserProperty("source", "test_source");
            verify(spyFA).setUserProperty("campaign_id", "test_campaign");
        }
    }
}
