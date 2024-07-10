package com.example.webjpademoapplicationsecondtry.utils;

public class DistanceConverter {

    private static final int EARTH_RADIUS = 6371;

    public static double calculateDistance(double latX, double lonX, double latY, double lonY) {
        // Convert latitude and longitude from degrees to radians
        double dLat = Math.toRadians(latY - latX);
        double dLon = Math.toRadians(lonY - lonX);
        latX = Math.toRadians(latX);
        latY = Math.toRadians(latY);

        // Haversine formula
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) *
                        Math.cos(latX) * Math.cos(latY);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

}
