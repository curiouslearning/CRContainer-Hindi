package org.curiouslearning.researchstudy.data.remote;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import org.curiouslearning.researchstudy.BuildConfig;
import org.curiouslearning.researchstudy.data.database.WebAppDatabase;
import org.curiouslearning.researchstudy.data.model.WebApp;
import org.curiouslearning.researchstudy.data.model.WebAppResponse;
import org.curiouslearning.researchstudy.utilities.CacheUtils;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitInstance {

    private static Retrofit retrofit;
    private static RetrofitInstance retrofitInstance;
    private Map<String, Object> data;

    private static String URL = BuildConfig.API_URL;;
    private List<WebApp> webApps;

    public static RetrofitInstance getInstance() {
        if (retrofit == null) {
            retrofitInstance = new RetrofitInstance();
            retrofit = new Retrofit.Builder()
                    .baseUrl(URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofitInstance;
    }

    public void getAppManifest(WebAppDatabase webAppDatabase) {
        ApiService api = retrofit.create(ApiService.class);
        Call<JsonElement> call = api.getWebApps(); // Assume your API call returns a raw JsonElement

        call.enqueue(new Callback<JsonElement>() {
            @Override
            public void onResponse(Call<JsonElement> call, Response<JsonElement> response) {
                if (response.isSuccessful()) {
                    JsonElement jsonElement = response.body();

                    if (jsonElement != null) {
                        JsonObject jsonObject = jsonElement.getAsJsonObject();
                        JsonElement versionElement = jsonObject.get("version");
                        WebAppResponse webAppResponse = findWebApps(jsonElement);
                        webAppResponse.setVersion(versionElement.getAsString());
                        if (webAppResponse != null) {
                            CacheUtils.setManifestVersionNumber(webAppResponse.getVersion());
                            List<WebApp> webApps = webAppResponse.getWebApps();
                            webAppDatabase.deleteWebApps(webApps);
                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<JsonElement> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wrong");
            }
        });
    }

    public void fetchAndCacheWebApps(WebAppDatabase webAppDatabase) {
        getAppManifest(webAppDatabase);
    }

    public void getUpdatedAppManifest(WebAppDatabase webAppDatabase, String manifestVersion) {
        ApiService api = retrofit.create(ApiService.class);
        Call<JsonElement> call = api.getWebApps(); // Assume your API call returns a raw JsonElement

        call.enqueue(new Callback<JsonElement>() {
            @Override
            public void onResponse(Call<JsonElement> call, Response<JsonElement> response) {
                if (response.isSuccessful()) {
                    JsonElement jsonElement = response.body();

                    if (jsonElement != null) {
                        JsonObject jsonObject = jsonElement.getAsJsonObject();
                        JsonElement versionElement = jsonObject.get("version");
                        WebAppResponse webAppResponse = findWebApps(jsonElement);
                        webAppResponse.setVersion(versionElement.getAsString());
                        String latestManifestVersion = webAppResponse.getVersion();
                        if (!Objects.equals(manifestVersion, latestManifestVersion)) {
                            CacheUtils.setManifestVersionNumber(latestManifestVersion);
                            webAppDatabase.deleteWebApps(webAppResponse.getWebApps());
                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<JsonElement> call, Throwable t) {
                System.out.println(t.getMessage() + "Something went wrong");
            }
        });

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
