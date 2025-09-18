package org.curiouslearning.researchstudy.utilities;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public class ConnectionUtils {
    private static ConnectionUtils ConnectionUtils;

    public static ConnectionUtils getInstance() {
        if (ConnectionUtils == null) {
            ConnectionUtils = new ConnectionUtils();
        }
        return ConnectionUtils;
    }

    public boolean isInternetConnected(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

        if (connectivityManager != null) {
            NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();

            if (activeNetworkInfo != null && activeNetworkInfo.isConnected()) {
                int type = activeNetworkInfo.getType();
                return type == ConnectivityManager.TYPE_WIFI || type == ConnectivityManager.TYPE_MOBILE;
            }
        }
        return false;
    }
}
