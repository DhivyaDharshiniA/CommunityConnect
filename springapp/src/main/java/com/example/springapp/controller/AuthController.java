//
//
//    package com.example.springapp.controller;
//
//    import com.example.springapp.entity.User;
//    import com.example.springapp.repository.UserRepository;
//    import org.springframework.beans.factory.annotation.Autowired;
//    import org.springframework.http.ResponseEntity;
//    import org.springframework.security.crypto.password.PasswordEncoder;
//    import org.springframework.web.bind.annotation.*;
//    import org.springframework.web.multipart.MultipartFile;
//
//    import com.example.springapp.security.JwtUtil;
//    import lombok.*;
//    import org.springframework.security.authentication.AuthenticationManager;
//    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//
//    import com.example.springapp.dto.AuthRequest;
//    import java.util.Map;
//
//
//    import java.io.IOException;
//    import java.nio.file.Files;
//    import java.nio.file.Path;
//    import java.nio.file.Paths;
//
//    @RestController
//    @RequiredArgsConstructor
//    @RequestMapping("/api/auth")
//    @CrossOrigin(origins = "http://localhost:5173")
//    public class AuthController {
//
//        @Autowired
//        private UserRepository userRepository;
//
//        @Autowired
//        private PasswordEncoder passwordEncoder;
//
//        private final AuthenticationManager authenticationManager;
//        private final JwtUtil jwtUtil;
//
//        @PostMapping(value = "/register", consumes = "multipart/form-data")
//        public ResponseEntity<?> register(
//                @RequestParam String name,
//                @RequestParam String email,
//                @RequestParam String password,
//                @RequestParam String role,
//                @RequestParam(required = false) MultipartFile proof
//        ) throws IOException {
//
//            if (userRepository.findByEmail(email).isPresent()) {
//                return ResponseEntity.badRequest().body("Email already exists");
//            }
//
//            User user = new User();
//            user.setName(name);
//            user.setEmail(email);
//            user.setPassword(passwordEncoder.encode(password));
//            user.setRole(role);
//            user.setVerified(false);
//
//            // If NGO, proof required
//            if ("ROLE_NGO".equals(role)) {
//
//                if (proof == null || proof.isEmpty()) {
//                    return ResponseEntity.badRequest().body("NGO proof document required");
//                }
//
//                // Create uploads folder if not exists
//                Path uploadDir = Paths.get("uploads");
//                if (!Files.exists(uploadDir)) {
//                    Files.createDirectories(uploadDir);
//                }
//
//                String fileName = System.currentTimeMillis() + "_" + proof.getOriginalFilename();
//                Path filePath = uploadDir.resolve(fileName);
//
//                Files.write(filePath, proof.getBytes());
//
//                user.setProofFilePath(filePath.toString());
//
//                // Dummy verification (can add OCR later)
//                user.setVerified(true);
//            }
//
//            userRepository.save(user);
//
//            return ResponseEntity.ok("Registration successful");
//        }
//
//        @PostMapping("/login")
//        public ResponseEntity<?> login(@RequestBody AuthRequest request) {
//
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            request.getEmail(),
//                            request.getPassword()
//                    )
//            );
//
//            String token = jwtUtil.generateToken(request.getEmail());
//
//            return ResponseEntity.ok(Map.of("token", token));
//        }
//
//    }


package com.example.springapp.controller;

import com.example.springapp.entity.User;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.security.JwtUtil;
import com.example.springapp.dto.AuthRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // In-memory OTP store (Use Redis/DB in production)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();


    // ───────────────── REGISTER ─────────────────
    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role,
            @RequestParam(required = false) MultipartFile proof
    ) throws IOException {

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setVerified(false);

        if ("ROLE_NGO".equals(role)) {

            if (proof == null || proof.isEmpty()) {
                return ResponseEntity.badRequest().body("NGO proof document required");
            }

            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String fileName = System.currentTimeMillis() + "_" + proof.getOriginalFilename();
            Path filePath = uploadDir.resolve(fileName);

            Files.write(filePath, proof.getBytes());
            user.setProofFilePath(filePath.toString());

            user.setVerified(true); // You can improve verification later
        }

        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }


    // ───────────────── LOGIN ─────────────────
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
//
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getEmail(),
//                        request.getPassword()
//                )
//        );
//
//        String token = jwtUtil.generateToken(request.getEmail());
//
//        return ResponseEntity.ok(Map.of("token", token));
//    }


    // ───────────────── LOGIN ─────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "role", user.getRole(),
                        "name", user.getName()
                )
        );
    }

    // ───────────────── SEND OTP ─────────────────
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Community Connect — Your Verification Code");
            message.setText(
                    "Hello!\n\n" +
                            "Your verification code is: " + otp + "\n\n" +
                            "Valid for 10 minutes.\n\n" +
                            "— Community Connect Team"
            );
            mailSender.send(message);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send email");
        }

        return ResponseEntity.ok("OTP sent successfully");
    }


    // ───────────────── VERIFY OTP ─────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP required");
        }

        String storedOtp = otpStore.get(email);

        if (storedOtp == null) {
            return ResponseEntity.badRequest().body("OTP expired or not found");
        }

        if (!storedOtp.equals(otp)) {
            return ResponseEntity.badRequest().body("Incorrect OTP");
        }

        otpStore.remove(email);

        return ResponseEntity.ok("OTP verified successfully");
    }
}