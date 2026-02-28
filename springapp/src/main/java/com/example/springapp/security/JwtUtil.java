////package com.example.springapp.security;
////
////import io.jsonwebtoken.Claims;
////import io.jsonwebtoken.Jwts;
////import io.jsonwebtoken.SignatureAlgorithm;
////import io.jsonwebtoken.security.Keys;
////import org.springframework.stereotype.Component;
////
////import java.security.Key;
////import java.util.Date;
////
////@Component
////public class JwtUtil {
////
////    private final String SECRET = "mysecretkeymysecretkeymysecretkey12";
////    // Must be at least 32 characters
////
////    private Key getSignKey() {
////        return Keys.hmacShaKeyFor(SECRET.getBytes());
////    }
////
////    public String generateToken(String email) {
////
////        return Jwts.builder()
////                .setSubject(email)
////                .setIssuedAt(new Date())
////                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
////                .signWith(getSignKey(), SignatureAlgorithm.HS256)
////                .compact();
////    }
////
////    public String extractEmail(String token) {
////        return extractAllClaims(token).getSubject();
////    }
////
////    private Claims extractAllClaims(String token) {
////        return Jwts.parserBuilder()
////                .setSigningKey(getSignKey())
////                .build()
////                .parseClaimsJws(token)
////                .getBody();
////    }
////}
//
//
//package com.example.springapp.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final String SECRET = "mysecretkeymysecretkeymysecretkeymysecretkey";
//    // Must be at least 32 characters for HS256
//
//    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
//
//    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour
//
//    // ✅ Generate Token
//    public String generateToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    // ✅ Extract Email
//    public String extractEmail(String token) {
//        return extractClaims(token).getSubject();
//    }
//
//    // ✅ Extract Expiration
//    public Date extractExpiration(String token) {
//        return extractClaims(token).getExpiration();
//    }
//
//    // ✅ Validate Token
//    public boolean validateToken(String token, UserDetails userDetails) {
//        final String email = extractEmail(token);
//        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }
//
//    // ✅ Check Expiration
//    private boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    // ✅ Extract Claims
//    private Claims extractClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}

package com.example.springapp.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET;

    public String generateToken(String username) {

        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
            String token = Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();

            return token;

        } catch (Exception e) {
            throw e;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
