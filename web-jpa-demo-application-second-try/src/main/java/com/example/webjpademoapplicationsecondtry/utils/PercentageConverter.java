package com.example.webjpademoapplicationsecondtry.utils;

public class PercentageConverter {
    public static Long getAmount(Long all, double percentage) {
        return (long) (all * percentage / 100.00);
    }

    public static double getPercentage(Long all, Long section) {
        return section * 100.00 / all;
    }

}
