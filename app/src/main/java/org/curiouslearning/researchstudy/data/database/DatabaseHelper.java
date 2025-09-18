package org.curiouslearning.researchstudy.data.database;

import android.content.Context;
import android.os.AsyncTask;

import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.sqlite.db.SupportSQLiteDatabase;

import org.curiouslearning.researchstudy.data.model.WebApp;
import org.curiouslearning.researchstudy.utilities.ConnectionUtils;

@Database(entities = { WebApp.class }, version = 2)
public abstract class DatabaseHelper extends RoomDatabase {

    private static DatabaseHelper instance;

    public abstract WebAppDao webAppDao();

    private static Context context;

    public static synchronized DatabaseHelper getInstance(Context context) {
        DatabaseHelper.context = context;
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(),
                    DatabaseHelper.class, "web_apps_database")
                    .fallbackToDestructiveMigration()
                    .addCallback(roomCallback)
                    .build();
        }
        return instance;
    }

    private static RoomDatabase.Callback roomCallback = new RoomDatabase.Callback() {
        @Override
        public void onCreate(@NonNull SupportSQLiteDatabase db) {
            super.onCreate(db);
            new PopulateDbAsyncTask(instance).execute();
        }
    };

    private static class PopulateDbAsyncTask extends AsyncTask<Void, Void, Void> {
        private WebAppDao webAppDao;

        private PopulateDbAsyncTask(DatabaseHelper db) {
            webAppDao = db.webAppDao();
        }

        @Override
        protected Void doInBackground(Void... voids) {
            if (ConnectionUtils.getInstance().isInternetConnected(DatabaseHelper.context)) {
                webAppDao.deleteAllWebApp();
            }
            return null;
        }
    }
}
