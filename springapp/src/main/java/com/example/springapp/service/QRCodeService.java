//////package com.example.springapp.service;
//////
//////import org.springframework.stereotype.Service;
//////
//////import com.google.zxing.BarcodeFormat;
//////import com.google.zxing.MultiFormatWriter;
//////import com.google.zxing.common.BitMatrix;
//////import com.google.zxing.client.j2se.MatrixToImageWriter;
//////
//////import java.nio.file.FileSystems;
//////import java.nio.file.Path;
//////
//////@Service
//////public class QRCodeService {
//////
//////    public String generateQRCode(String text, Long eventId) throws Exception {
//////
//////        int width = 300;
//////        int height = 300;
//////
//////        BitMatrix bitMatrix = new MultiFormatWriter()
//////                .encode(text, BarcodeFormat.QR_CODE, width, height);
//////
//////        String path = "qrcodes/event_" + eventId + ".png";
//////        Path filePath = FileSystems.getDefault().getPath(path);
//////
//////        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", filePath);
//////
//////        return path;
//////    }
//////}
////
////package com.example.springapp.service;
////
////import com.google.zxing.BarcodeFormat;
////import com.google.zxing.qrcode.QRCodeWriter;
////import com.google.zxing.common.BitMatrix;
////import com.google.zxing.client.j2se.MatrixToImageWriter;
////
////import org.springframework.stereotype.Service;
////
////import java.nio.file.Files;
////import java.nio.file.Path;
////import java.nio.file.Paths;
////
////@Service
////public class QRCodeService {
////
////    public String generateQRCode(String text, Long eventId) throws Exception {
////
////        int width = 300;
////        int height = 300;
////
////        QRCodeWriter qrCodeWriter = new QRCodeWriter();
////        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
////
////        // Create folder if not exists
////        String folder = "qrcodes";
////        Path folderPath = Paths.get(folder);
////
////        if (!Files.exists(folderPath)) {
////            Files.createDirectories(folderPath);
////        }
////
////        String filePath = folder + "/event_" + eventId + ".png";
////        Path path = Paths.get(filePath);
////
////        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
////
////        return filePath;
////    }
////}
//
//package com.example.springapp.service;
//
//import com.google.zxing.BarcodeFormat;
//import com.google.zxing.qrcode.QRCodeWriter;
//import com.google.zxing.common.BitMatrix;
//import com.google.zxing.client.j2se.MatrixToImageWriter;
//
//import org.springframework.stereotype.Service;
//
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//
//@Service
//public class QRCodeService {
//
//    public String generateQRCode(Long eventId) throws Exception {
//
//        // This URL will be opened when scanned
//        String text = "http://localhost:8080/api/events/attend/" + eventId;
//
//        int width = 300;
//        int height = 300;
//
//        QRCodeWriter qrCodeWriter = new QRCodeWriter();
//        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
//
//        String folder = "qrcodes";
//        Path folderPath = Paths.get(folder);
//
//        if (!Files.exists(folderPath)) {
//            Files.createDirectories(folderPath);
//        }
//
//        String filePath = folder + "/event_" + eventId + ".png";
//        Path path = Paths.get(filePath);
//
//        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
//
//        return filePath;
//    }
//}

package com.example.springapp.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

//@Service
//public class QRCodeService {
//
//    public String generateQRCode(Long eventId) throws Exception {
//
//        String text = "http://localhost:8080/api/attendance/" + eventId;
//        int width = 300;
//        int height = 300;
//
//        QRCodeWriter qrCodeWriter = new QRCodeWriter();
//        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
//
//        String folder = "qrcodes";
//        Path folderPath = Paths.get(folder);
//        if (!Files.exists(folderPath)) Files.createDirectories(folderPath);
//
//        String fileName = "event_" + eventId + ".png";
//        Path path = Paths.get(folder, fileName);
//
//        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
//
//        return fileName; // just the filename
//    }
//}

@Service
public class QRCodeService {

    public String generateQRCode(Long eventId) throws Exception {

        // This should open React page
        String text = "http://10.74.31.23:5173/attendance/" + eventId;

        int width = 300;
        int height = 300;

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix =
                qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        String folder = "qrcodes";
        Path folderPath = Paths.get(folder);
        if (!Files.exists(folderPath)) Files.createDirectories(folderPath);

        String fileName = "event_" + eventId + ".png";
        Path path = Paths.get(folder, fileName);

        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

        return fileName;
    }
}