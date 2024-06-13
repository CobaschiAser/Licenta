package com.example.webjpademoapplicationsecondtry.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class JwtUtil {
    private static final String SECRET_KEY = "my_secret_key";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours
    public static String generateToken(String authenticationToken, Integer isAdmin, String username, String uuid) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("authenticationToken", authenticationToken);
        claims.put("isAdmin", isAdmin.toString());
        claims.put("username", username);
        claims.put("uuid", uuid);
       return Jwts.builder()
                .setClaims(claims)
                .setSubject(authenticationToken)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static Claims parseToken(String token) {
       //System.out.println("Before");
       Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
       //System.out.println("After");
       return claims;
    }

    public static String getAuthenticationToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("authenticationToken").toString();
    }

    public static String getUuid(String token) {
        Claims claims = parseToken(token);
        return claims.get("uuid").toString();
    }

    public static String getUsername(String token) {
        Claims claims = parseToken(token);
        return claims.get("username").toString();
    }

    public static Integer getIsAdmin(String token) {
        Claims claims = parseToken(token);
        return Integer.parseInt(claims.get("isAdmin").toString());
    }


    public static boolean isValidToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return false;
        }
        String authToken = token.substring(7);

        return !authToken.isEmpty();
    }
    public static boolean isAuthorizedAdmin(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return false;
        }
        String authToken = token.substring(7);

        if (authToken.isEmpty()) {
            return false;
        }

        return JwtUtil.getIsAdmin(authToken) == 1;

    }

    public static boolean isAuthorizedUser(String token, UUID id) {
        if (token == null || !token.startsWith("Bearer ")) {
            return false;
        }
        String authToken = token.substring(7);

        if (authToken.isEmpty()) {
            return false;
        }

        return JwtUtil.getIsAdmin(authToken) == 1 || JwtUtil.getUuid(authToken).compareTo(id.toString()) == 0;

    }


}
