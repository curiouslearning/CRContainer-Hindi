package org.curiouslearning.researchstudy.data.database;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import org.curiouslearning.researchstudy.data.model.WebApp;
import java.util.List;

@Dao
public interface WebAppDao {

    @Insert
    void insert(WebApp webApp);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<WebApp> webApp);

    @Query("DELETE FROM web_app_table")
    void deleteAllWebApp();

    @Query("SELECT * FROM web_app_table where LOWER(languageInEnglishName) = LOWER(:selectedLanguage) ORDER BY appId ASC")
    LiveData<List<WebApp>> getSelectedlanguageWebApps(String selectedLanguage);

    @Query("SELECT * FROM web_app_table  ORDER BY appId ASC")
    LiveData<List<WebApp>> getAllWebApp();

    @Query("SELECT languageInEnglishName FROM web_app_table")
    LiveData<List<String>> getAllLanguagesInEnglish();
}
