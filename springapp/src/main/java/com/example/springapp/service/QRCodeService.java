

package com.example.springapp.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;



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