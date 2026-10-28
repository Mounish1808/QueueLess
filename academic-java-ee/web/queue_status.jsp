<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.queueless.model.TokenBean"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Token Status — QueueLess Java EE</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 2rem; }
        .card { max-width: 500px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 12px; border: 2px dashed #6366f1; text-align: center; }
        .token { font-family: monospace; font-size: 2.5rem; font-weight: bold; color: #818cf8; margin: 1rem 0; letter-spacing: 2px; }
        .details { background: #0f172a; padding: 1rem; border-radius: 8px; text-align: left; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .details div { margin-bottom: 0.5rem; }
        a { color: #38bdf8; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="card">
        <%
            TokenBean token = (TokenBean) request.getAttribute("token");
            if (token != null) {
        %>
            <h2 style="color: #34d399; margin-top: 0;">Queue Token Generated!</h2>
            <div class="token"><%= token.getTokenNumber() %></div>
            <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;"><%= token.getServiceName() %></div>

            <div class="details">
                <div><strong>Token ID:</strong> <%= token.getTokenId() %></div>
                <div><strong>Student Name:</strong> <%= token.getStudentName() %></div>
                <div><strong>Mobile:</strong> <%= token.getStudentPhone() %></div>
                <div><strong>Queue Position:</strong> #<%= token.getQueuePosition() %> in line</div>
                <div><strong>Estimated Waiting:</strong> ~<%= token.getEstimatedWaitMins() %> minutes</div>
                <div><strong>Status:</strong> <span style="color: #fbbf24;"><%= token.getStatus().toUpperCase() %></span></div>
                <div><strong>Session User:</strong> <%= session.getAttribute("userEmail") %></div>
            </div>

            <a href="booking.jsp">&larr; Book Another Token</a>
        <% } else { %>
            <p>No token found in current request scope.</p>
            <a href="booking.jsp">&larr; Return to Form</a>
        <% } %>
    </div>
</body>
</html>
