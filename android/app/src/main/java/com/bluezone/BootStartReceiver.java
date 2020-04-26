package com.bluezone;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.scan.ServiceTraceCovid;

/**
 * Class chạy khi start lại
 *
 * @author khanhxu
 */
public class BootStartReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        try {
            Log.e("bluezone", "BootStartReceiver");
            Intent intentStart = new Intent(context, ServiceTraceCovid.class);

            // Start service
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intentStart);
            } else {
                context.startService(intentStart);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
