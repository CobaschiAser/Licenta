package com.example.webjpademoapplicationsecondtry.utils;

import java.sql.Date;
import java.time.LocalDateTime;

public class PeriodConverter {
    public static Date convertPeriodToDate(String period){

        Date result = null;
        LocalDateTime currentDayTime = LocalDateTime.now();
        switch(period) {
            case "1d":
                result = java.sql.Date.valueOf(currentDayTime.toLocalDate());
                break;
            case "7d":
                result = java.sql.Date.valueOf(currentDayTime.minusWeeks((long)1).toLocalDate());
                // code block
                break;
            case "1m":
                result = java.sql.Date.valueOf(currentDayTime.toLocalDate().minusMonths((long) 1));
                break;
            case "6m":
                result = java.sql.Date.valueOf(currentDayTime.toLocalDate().minusMonths((long)6));
                break;
            case "1y":
                result = java.sql.Date.valueOf(currentDayTime.toLocalDate().minusYears((long)1));
            default:
                result = java.sql.Date.valueOf(currentDayTime.toLocalDate().minusYears((long)10));
                // code block
        }
        System.out.println(result);
        return result;
    }
}
