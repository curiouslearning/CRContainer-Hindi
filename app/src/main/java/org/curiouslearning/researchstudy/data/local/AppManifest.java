package org.curiouslearning.researchstudy.data.local;

import android.content.res.AssetManager;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.researchstudy.data.model.WebApp;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class AppManifest {

    public final String jsonFileName = "web_apps_manifest.json";

    public static AppManifest instance;

    public static AppManifest getAppManifest() {
        if (instance == null) {
            instance = new AppManifest();
        }
        return instance;
    }


    public String getData(AssetManager assetManager) {
        try {
            InputStream inputStream = assetManager.open(jsonFileName);
            byte[] buffer = new byte[inputStream.available()];
            inputStream.read(buffer);
            inputStream.close();
            return new String(buffer, StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }


    public List<WebApp> getAllWebApps(AssetManager assetManager) {
        String jsonData = getData(assetManager);
        Type listType = new TypeToken<List<WebApp>>(){}.getType();
        List<WebApp> webApps =  new Gson().fromJson(convertToJsonArray(jsonData).toString(), listType);
        return webApps;
    }

    public JsonArray convertToJsonArray(String jsonData) {
        JsonArray jsonArray = new JsonParser().parse(jsonData).getAsJsonArray();
        return jsonArray;
    }
}
