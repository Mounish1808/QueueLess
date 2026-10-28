package com.queueless.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

/**
 * SessionTrackingServlet — Dedicated Session & Cookie Demonstration
 * Explains:
 * - HttpSession creation, attributes, timeout, and invalidation
 * - Cookie inspection, maxAge, and path
 */
@WebServlet(name = "SessionTrackingServlet", urlPatterns = {"/sessionDemo"})
public class SessionTrackingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // Obtain existing session or create new one
        HttpSession session = request.getSession(true);

        Integer visitCount = (Integer) session.getAttribute("visitCount");
        if (visitCount == null) {
            visitCount = 1;
        } else {
            visitCount++;
        }
        session.setAttribute("visitCount", visitCount);

        // Read Client Cookies
        Cookie[] cookies = request.getCookies();
        String lastVisitCookieVal = "None detected";
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("lastBookingTimestamp".equals(c.getName())) {
                    lastVisitCookieVal = new Date(Long.parseLong(c.getValue())).toString();
                    break;
                }
            }
        }

        out.println("<!DOCTYPE html>");
        out.println("<html><head><title>Java EE Session Tracking Demo</title></head>");
        out.println("<body style='font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem;'>");
        out.println("<h2>QueueLess Java EE — Session & Cookie Demonstration</h2>");
        out.println("<p>Session ID: <code>" + session.getId() + "</code></p>");
        out.println("<p>Session Created At: " + new Date(session.getCreationTime()) + "</p>");
        out.println("<p>Session Last Accessed: " + new Date(session.getLastAccessedTime()) + "</p>");
        out.println("<p>Page Visits in Session: <strong>" + visitCount + "</strong></p>");
        out.println("<p>Client Cookie (lastBookingTimestamp): <strong>" + lastVisitCookieVal + "</strong></p>");
        out.println("<br/><a href='booking.jsp' style='color: #818cf8;'>Return to Booking JSP</a>");
        out.println("</body></html>");
    }
}
