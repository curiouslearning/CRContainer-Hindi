package org.curiouslearning.researchstudy;

import android.os.SystemClock;
import android.view.View;

import androidx.annotation.IdRes;
import androidx.recyclerview.widget.RecyclerView;
import androidx.test.espresso.UiController;
import androidx.test.espresso.ViewAction;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.espresso.matcher.RootMatchers;
import androidx.test.espresso.contrib.RecyclerViewActions;

import org.hamcrest.Matcher;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.FixMethodOrder;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.*;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static junit.framework.TestCase.assertEquals;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.startsWith;
import static org.hamcrest.object.HasToString.hasToString;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@RunWith(AndroidJUnit4.class)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MainActivityTest {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void test01_languagePopupIsShown_andLanguagesDisplayed() {
        onView(withId(R.id.autoComplete))
                .check(matches(isDisplayed()));

    }

    @Test
    public void test02_clickDropdown_showsMenu() {
        onView(withId(R.id.dropdown_menu)).perform(click());

    }

    //    @Test
//    public void test_dropdownIsScrollable() {
//        SystemClock.sleep(2000);
//        onView(withId(R.id.dropdown_menu)).perform(click());
//        SystemClock.sleep(2000);
//        onData(anything())
//                .inRoot(RootMatchers.isPlatformPopup())
//                .atPosition(55)
//                .check(matches(isDisplayed()));
//    }
    @Test
    public void test03_dropdownIsScrollableToZulu() {
        SystemClock.sleep(2000);

        // Open the dropdown
        onView(withId(R.id.dropdown_menu)).perform(click());
        SystemClock.sleep(1000);

        // Scroll and verify that the item with "Zulu" is displayed
        onData(hasToString(startsWith("Isizulu")))
                .inRoot(RootMatchers.isPlatformPopup())
                .check(matches(isDisplayed()));
    }

    @Test
    public void test04_closeButton() {
        SystemClock.sleep(2000);
        onView(withId(R.id.setting_close)).perform(click());

    }
    @Test
    public void test05_languageChangeViaSettingsButton() {
        SystemClock.sleep(2000);

        onView(withId(R.id.dropdown_menu)).perform(click());
        SystemClock.sleep(1000);

        onData(hasToString(startsWith("Isizulu")))
                .inRoot(RootMatchers.isPlatformPopup())
                .check(matches(isDisplayed())).perform(click());

        SystemClock.sleep(3000);
//        onView(withId(R.id.settings)).perform(click());
        SystemClock.sleep(1000);
        onView(withId(R.id.dropdown_menu)).perform(click());
        SystemClock.sleep(1000);

        onData(hasToString(startsWith("हिन्दी")))
                .inRoot(RootMatchers.isPlatformPopup())
                .check(matches(isDisplayed())).perform(click());
        SystemClock.sleep(2000);
        onView(withId(R.id.recycleView))
                .perform(RecyclerViewActions.actionOnItemAtPosition(0, click()));
        SystemClock.sleep(5000);
        onView(withId(R.id.button2)).perform(click());
    }
    @Test
    public void test06_webappScreenIsScrollable(){
        SystemClock.sleep(2000);
        onView(withId(R.id.recycleView))
                .perform(RecyclerViewActions.scrollToPosition(15));
        SystemClock.sleep(2000);
        onView(withId(R.id.recycleView))
                .perform(RecyclerViewActions.scrollToPosition(0));
    }

    public int getRecyclerViewItemCount(@IdRes int recyclerViewId) {
        final int[] itemCount = {0};
        onView(withId(recyclerViewId)).perform(new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return ViewMatchers.isAssignableFrom(RecyclerView.class);
            }
            @Override
            public String getDescription() {
                return "Get RecyclerView item count";
            }
            @Override
            public void perform(UiController uiController, View view) {
                RecyclerView recyclerView = (RecyclerView) view;
                itemCount[0] = recyclerView.getAdapter().getItemCount();
            }
        });
        return itemCount[0];
    }
    @Test
    public void test07_verifyWebappsCount() throws Exception {
        String apiUrl = BuildConfig.API_URL + "web_app_manifest.json"; // Add the actual endpoint here
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder jsonBuilder = new StringBuilder();
        String inputLine;
        while ((inputLine = in.readLine()) != null) {
            jsonBuilder.append(inputLine);
        }
        in.close();

        JSONObject root = new JSONObject(jsonBuilder.toString());
        JSONArray apps = root.getJSONArray("web_apps");

        int hindiCount = 0;
        for (int i = 0; i < apps.length(); i++) {
            JSONObject app = apps.getJSONObject(i);
            String language = app.optString("language");
            String languageInEnglishName = app.optString("languageInEnglishName");

            if ("Hindi".equalsIgnoreCase(language) || "Hindi".equalsIgnoreCase(languageInEnglishName)) {
                hindiCount++;
            }
        }
        int apiHindiCount = hindiCount;
        int recyclerViewCount = getRecyclerViewItemCount(R.id.recycleView);
        assertEquals("Mismatch between API Hindi count and RecyclerView items", apiHindiCount, recyclerViewCount);
    }

    @Test
    public void test08_clickSettingButton() {
        SystemClock.sleep(1000);
//        onView(withId(R.id.settings)).perform(click());
        SystemClock.sleep(1000);
        onView(withId(R.id.dropdown_menu)).perform(click());
    }
}