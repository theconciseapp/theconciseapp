package com.extra;
import android.content.Context;
import android.net.Uri;
import androidx.documentfile.provider.DocumentFile;

public class Extra {
  public static String getNameForUri(Context context,Uri uri) {
    return DocumentFile.fromSingleUri(context,uri).getName();
  }  
}

