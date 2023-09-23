package ir.samatco.smt.util;

import ir.samatco.smt.fanapPayment.constant.FanapConstant;
import org.apache.commons.codec.binary.Base64;

import java.math.BigInteger;
import java.security.*;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;


// This util file is to generate the key pairs (Public/Private)
public class LoadKeyPair {

    public static void main(String args[]) {
        try {
            loadKeyPair();
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
        }
    }

    private static KeyPair loadKeyPair() throws GeneralSecurityException {

        byte[] modulusBytes = Base64.decodeBase64(FanapConstant.MODULUS_KEY);
        byte[] exponentBytes = Base64.decodeBase64(FanapConstant.EXPONENT_KEY);
        byte[] dBytes = Base64.decodeBase64(FanapConstant.D_KEY);
        BigInteger modulus = new BigInteger(1, modulusBytes);
        BigInteger exponent = new BigInteger(1, exponentBytes);
        BigInteger d = new BigInteger(1, dBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        RSAPublicKeySpec rsaPublicKeySpec = new RSAPublicKeySpec(modulus, exponent);
        PublicKey publicKey = keyFactory.generatePublic(rsaPublicKeySpec);
        byte[] publicByte = publicKey.getEncoded();
        System.out.println(Base64.encodeBase64String(publicByte));// This is the public KEY
        RSAPrivateKeySpec rsaPrivateKeySpec = new RSAPrivateKeySpec(modulus, d);
        PrivateKey privateKey = keyFactory.generatePrivate(rsaPrivateKeySpec);
        return new KeyPair(publicKey, privateKey);
    }
}
