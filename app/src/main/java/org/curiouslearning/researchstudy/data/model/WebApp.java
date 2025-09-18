package org.curiouslearning.researchstudy.data.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "web_app_table")
public class WebApp {

    @PrimaryKey(autoGenerate = false)
    private int appId;

    private String title;

    private String language;

    private String appUrl;

    private String appIconUrl;

    private String languageInEnglishName;

    public int getAppId() {
        return appId;
    }

    public void setAppId(int appId) {
        this.appId = appId;
    }

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }

    public String getAppIconUrl() {
        return (appIconUrl);
    }

    public void setAppIconUrl(String appIconUrl) {
        this.appIconUrl = appIconUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLanguage() {
        return language;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLanguageInEnglishName() {
        return languageInEnglishName;
    }

    public void setLanguageInEnglishName(String languageInEnglishName) {
        this.languageInEnglishName = languageInEnglishName;
    }

}
