<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QueueLess — Java EE Booking Demonstration</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 2rem; }
        .card { max-width: 500px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; }
        h2 { color: #818cf8; margin-top: 0; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; }
        input, select { width: 100%; box-sizing: border-box; padding: 0.6rem; border-radius: 6px; background: #0f172a; border: 1px solid #475569; color: #fff; }
        button { width: 100%; padding: 0.75rem; background: #4f46e5; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
        button:hover { background: #4338ca; }
        .error { background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 0.6rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; }
    </style>
</head>
<body>
    <div class="card">
        <h2>QueueLess (Java Servlet / JSP Demo)</h2>
        <p style="font-size: 0.85rem; color: #94a3b8;">Academic exercise demonstrating Form Processing, MVC, and JDBC.</p>

        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="error"><%= request.getAttribute("errorMessage") %></div>
        <% } %>

        <form action="bookQueue" method="POST">
            <div class="form-group">
                <label for="serviceId">Select Service:</label>
                <select name="serviceId" id="serviceId">
                    <option value="S1">Admissions &amp; Document Verification</option>
                    <option value="S2">Fee Payment &amp; Scholarship Desk</option>
                    <option value="S3">Central Library Clearance</option>
                    <option value="S4">Examination Branch</option>
                </select>
                <input type="hidden" name="serviceName" value="Admissions &amp; Document Verification" />
            </div>

            <div class="form-group">
                <label for="studentName">Student Full Name:</label>
                <input type="text" name="studentName" id="studentName" value="Aarav Sharma" required />
            </div>

            <div class="form-group">
                <label for="studentPhone">Mobile Number (10 Digits):</label>
                <input type="tel" name="studentPhone" id="studentPhone" value="9876543210" maxlength="10" required />
            </div>

            <button type="submit">Generate Token via Java Servlet</button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.8rem;">
            <a href="sessionDemo" style="color: #38bdf8;">Inspect HttpSession &amp; Cookies Demo &rarr;</a>
        </div>
    </div>
</body>
</html>
