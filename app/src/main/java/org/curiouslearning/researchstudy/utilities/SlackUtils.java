package org.curiouslearning.researchstudy.utilities;

import android.content.Context;
import android.util.Log;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SlackUtils {
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    // Method to send message to Slack
    public static void sendMessageToSlack(Context context, String message) {
        try {
            new SendSlackMessageTask(context).execute(message);
        } catch (Exception e) {
            Log.e("SLACK-ERROR", "Error occurred while sending Slack message: ", e);
            return;
        }
    }

    // AsyncTask to send Slack message in the background
    private static class SendSlackMessageTask extends android.os.AsyncTask<String, Void, Void> {
        private Context context;

        public SendSlackMessageTask(Context context) {
            this.context = context;
        }

        @Override
        protected Void doInBackground(String... messages) {
            String webHookUrl = ConfigLoader.getSlackWebhookUrl(context);
            if (webHookUrl == null) {
                System.out.println("Slack Webhook URL not found");
                return null;
            }

            OkHttpClient client = new OkHttpClient();
            String jsonPayload = "{\"text\": \"" + messages[0] + "\"}";

            RequestBody body = RequestBody.create(JSON, jsonPayload);
            Request request = new Request.Builder()
                    .url(webHookUrl)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new RuntimeException("Slack message failed: " + response);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }
    }
}
