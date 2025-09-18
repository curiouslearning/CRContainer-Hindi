package org.curiouslearning.researchstudy.data.database;

import android.app.Application;
import android.os.AsyncTask;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;

import org.curiouslearning.researchstudy.data.model.WebApp;

import java.util.List;

public class WebAppDatabase {

    private WebAppDao webAppDao;

    public WebAppDatabase(Application application) {
        DatabaseHelper database = DatabaseHelper.getInstance(application);
        webAppDao = database.webAppDao();
    }

    public void insertAll(List<WebApp> webApps) {
        new InsertAllWebAppAsyncTask(webAppDao).execute(webApps);
    }

     public void deleteWebApps(List<WebApp> webApps) {
        new DeleteAllWebAppAsyncTask(webAppDao, webApps).execute();
     }


    public LiveData<List<WebApp>> getAllWebApps() {
        return webAppDao.getAllWebApp();
    }

    public LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage) {
        return webAppDao.getSelectedlanguageWebApps(selectedLanguage);
    }
    public LiveData<List<String>> getAllLanguagesInEnglish() {
        return webAppDao.getAllLanguagesInEnglish();
    }

    private static class InsertAllWebAppAsyncTask extends AsyncTask<List<WebApp>, Void, Void> {
        private WebAppDao WebAppDao;

        private InsertAllWebAppAsyncTask(WebAppDao WebAppDao) {
            this.WebAppDao = WebAppDao;
        }

        @Nullable
        @Override
        protected Void doInBackground(@NonNull List<WebApp>... WebApps) {
            WebAppDao.insertAll(WebApps[0]);
            return null;
        }
    }

    private static class DeleteAllWebAppAsyncTask extends AsyncTask<Void, Void, Void> {
        private WebAppDao webAppDao;
        private List<WebApp> webApps;

        private DeleteAllWebAppAsyncTask(WebAppDao WebAppDao, List<WebApp> webApps)  {
            this.webAppDao = WebAppDao;
            this.webApps = webApps;
        }

        @Override
        protected Void doInBackground(Void... voids) {
            webAppDao.deleteAllWebApp();
            webAppDao.insertAll( webApps);

            return null;
        }
    }
}
