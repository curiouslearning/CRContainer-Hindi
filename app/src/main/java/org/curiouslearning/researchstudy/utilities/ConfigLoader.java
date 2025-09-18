package org.curiouslearning.researchstudy.utilities;

import android.content.Context;
import java.io.InputStream;
import java.util.Properties;

public class ConfigLoader {
    public static String getSlackWebhookUrl(Context context) {
        try {
            Properties properties = new Properties();
            InputStream inputStream = context.getAssets().open("config.properties");
            properties.load(inputStream);
            return properties.getProperty("SLACK_WEBHOOK_URL");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
