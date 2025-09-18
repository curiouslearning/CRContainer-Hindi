package org.curiouslearning.researchstudy.data.local;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.researchstudy.data.database.WebAppDatabase;
import org.curiouslearning.researchstudy.data.model.WebApp;
import org.curiouslearning.researchstudy.data.model.WebAppResponse;
import org.curiouslearning.researchstudy.utilities.CacheUtils;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

public class ManifestLoader {

    private static final String LOCAL_MANIFEST_FILE = "web_apps_manifest.json";
    private static ManifestLoader instance;

    private ManifestLoader() {
    }

    public static ManifestLoader getInstance() {
        if (instance == null) {
            instance = new ManifestLoader();
        }
        return instance;
    }

    public void loadLocalManifest(Context context, WebAppDatabase webAppDatabase) {
        try {
            InputStream inputStream = context.getAssets().open(LOCAL_MANIFEST_FILE);
            JsonElement jsonElement = new Gson().fromJson(new InputStreamReader(inputStream), JsonElement.class);

            if (jsonElement != null && jsonElement.isJsonObject()) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                JsonElement versionElement = jsonObject.get("version");

                WebAppResponse webAppResponse = findWebApps(jsonElement);
                if (webAppResponse != null) {
                    if (versionElement != null) {
                        webAppResponse.setVersion(versionElement.getAsString());
                        CacheUtils.setManifestVersionNumber(webAppResponse.getVersion());
                    }

                    List<WebApp> webApps = webAppResponse.getWebApps();
                    webAppDatabase.deleteWebApps(webApps);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private WebAppResponse findWebApps(JsonElement element) {
        if (element.isJsonObject()) {
            JsonObject jsonObject = element.getAsJsonObject();

            for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {
                String key = entry.getKey();
                JsonElement value = entry.getValue();

                if (key.equals("web_apps") && value.isJsonArray()) {
                    WebAppResponse webAppResponse = new WebAppResponse();
                    List<WebApp> webApps = new Gson().fromJson(value, new TypeToken<List<WebApp>>() {
                    }.getType());
                    webAppResponse.setWebApp(webApps);
                    return webAppResponse;
                } else if (value.isJsonObject()) {
                    WebAppResponse nestedResponse = findWebApps(value);
                    if (nestedResponse != null) {
                        return nestedResponse;
                    }
                }
            }
        }
        return null;
    }
}
