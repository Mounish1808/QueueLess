package com.queueless.servlet;

import com.queueless.dao.TokenDAO;
import com.queueless.model.TokenBean;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

/**
 * QueueBookingServlet — Controller Layer in Three-Tier Architecture
 * Demonstrates:
 * 1. Handling HTTP POST requests
 * 2. Form input validation using regular expressions in Java
 * 3. Session tracking via HttpSession
 * 4. Client state tracking via Cookies
 * 5. Request forwarding to dynamic JSP views
 */
@WebServlet(name = "QueueBookingServlet", urlPatterns = {"/bookQueue"})
public class QueueBookingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private TokenDAO tokenDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        tokenDAO = new TokenDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Forward to the booking form JSP
        request.getRequestDispatcher("/booking.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Session Tracking Demonstration (Syllabus Topic)
        HttpSession session = request.getSession(true);
        String sessionUser = (String) session.getAttribute("userEmail");
        if (sessionUser == null) {
            session.setAttribute("userEmail", "student@college.edu");
            session.setAttribute("role", "customer");
        }

        // Cookie Handling Demonstration (Syllabus Topic)
        Cookie tokenHistoryCookie = new Cookie("lastBookingTimestamp", String.valueOf(System.currentTimeMillis()));
        tokenHistoryCookie.setMaxAge(60 * 60 * 24 * 7); // 7 days retention
        tokenHistoryCookie.setPath("/");
        response.addCookie(tokenHistoryCookie);

        // Read form parameters
        String serviceId = request.getParameter("serviceId");
        String serviceName = request.getParameter("serviceName");
        String studentName = request.getParameter("studentName");
        String studentPhone = request.getParameter("studentPhone");

        // Java Regex Validation (Syllabus Topic)
        if (studentName == null || !studentName.matches("^[a-zA-Z\\s.]{3,50}$")) {
            request.setAttribute("errorMessage", "Validation Error: Student name must be 3-50 letters.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        if (studentPhone == null || !studentPhone.matches("^[6-9]\\d{9}$")) {
            request.setAttribute("errorMessage", "Validation Error: Mobile number must be 10 digits starting with 6-9.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        if (serviceName == null || serviceName.trim().isEmpty()) {
            serviceName = "Admissions & Verification";
        }

        // Delegate to Data Access Object (Business Logic & Database Tier)
        TokenBean generatedToken = tokenDAO.createToken(serviceId, serviceName, studentName, studentPhone);

        // Set request attribute and forward to JSP view (Presentation Tier)
        request.setAttribute("token", generatedToken);
        request.getRequestDispatcher("/queue_status.jsp").forward(request, response);
    }
}
