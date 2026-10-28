package com.queueless.dao;

import com.queueless.model.TokenBean;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * TokenDAO — Data Access Object (Database Layer in Three-Tier Architecture)
 * Handles JDBC connection management, PreparedStatement queries, and ResultSets.
 */
public class TokenDAO {
    // Database credentials (MySQL / MariaDB or SQLite)
    private static final String DB_URL = "jdbc:mysql://localhost:3306/queueless_db?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "";

    // Method to obtain database connection
    protected Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    /**
     * Inserts a new token record into the database using PreparedStatement
     */
    public TokenBean createToken(String serviceId, String serviceName, String studentName, String studentPhone) {
        String tokenId = "T-" + System.currentTimeMillis();
        String tokenNumber = "ADM-" + (100 + (int)(Math.random() * 900));
        int queuePosition = 1;
        int estimatedWaitMins = 15;
        String status = "waiting";

        String insertSQL = "INSERT INTO tokens (id, token_number, service_id, service_name, user_id, user_name, user_email, user_phone, booking_date, slot_time, status, queue_position, estimated_wait_mins) "
                         + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), '10:00 AM', ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(insertSQL)) {

            pstmt.setString(1, tokenId);
            pstmt.setString(2, tokenNumber);
            pstmt.setString(3, serviceId);
            pstmt.setString(4, serviceName);
            pstmt.setString(5, "u-student-1");
            pstmt.setString(6, studentName);
            pstmt.setString(7, "student@college.edu");
            pstmt.setString(8, studentPhone);
            pstmt.setString(9, status);
            pstmt.setInt(10, queuePosition);
            pstmt.setInt(11, estimatedWaitMins);

            pstmt.executeUpdate();

        } catch (Exception e) {
            System.err.println("Database error in createToken (falling back to memory demo): " + e.getMessage());
        }

        return new TokenBean(tokenId, tokenNumber, serviceId, serviceName, studentName, studentPhone, queuePosition, estimatedWaitMins, status, "Just now");
    }

    /**
     * Reads all active waiting tokens for a given service
     */
    public List<TokenBean> getWaitingTokens(String serviceId) {
        List<TokenBean> list = new ArrayList<>();
        String selectSQL = "SELECT id, token_number, service_id, service_name, user_name, user_phone, queue_position, estimated_wait_mins, status, created_at "
                         + "FROM tokens WHERE service_id = ? AND status = 'waiting' ORDER BY queue_position ASC";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(selectSQL)) {

            pstmt.setString(1, serviceId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    TokenBean bean = new TokenBean(
                        rs.getString("id"),
                        rs.getString("token_number"),
                        rs.getString("service_id"),
                        rs.getString("service_name"),
                        rs.getString("user_name"),
                        rs.getString("user_phone"),
                        rs.getInt("queue_position"),
                        rs.getInt("estimated_wait_mins"),
                        rs.getString("status"),
                        rs.getString("created_at")
                    );
                    list.add(bean);
                }
            }
        } catch (Exception e) {
            System.err.println("Database query error: " + e.getMessage());
        }
        return list;
    }
}
