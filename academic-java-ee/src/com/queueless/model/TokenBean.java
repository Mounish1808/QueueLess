package com.queueless.model;

import java.io.Serializable;

/**
 * TokenBean — Java Bean (Model Layer in Three-Tier Architecture)
 * Encapsulates campus queue token attributes with private fields,
 * no-argument constructor, and public getter/setter methods.
 */
public class TokenBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String tokenId;
    private String tokenNumber;
    private String serviceId;
    private String serviceName;
    private String studentName;
    private String studentPhone;
    private int queuePosition;
    private int estimatedWaitMins;
    private String status;
    private String createdAt;

    public TokenBean() {
        // Default constructor required for JavaBean specification
    }

    public TokenBean(String tokenId, String tokenNumber, String serviceId, String serviceName,
                     String studentName, String studentPhone, int queuePosition, int estimatedWaitMins,
                     String status, String createdAt) {
        this.tokenId = tokenId;
        this.tokenNumber = tokenNumber;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.studentName = studentName;
        this.studentPhone = studentPhone;
        this.queuePosition = queuePosition;
        this.estimatedWaitMins = estimatedWaitMins;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public int getQueuePosition() { return queuePosition; }
    public void setQueuePosition(int queuePosition) { this.queuePosition = queuePosition; }

    public int getEstimatedWaitMins() { return estimatedWaitMins; }
    public void setEstimatedWaitMins(int estimatedWaitMins) { this.estimatedWaitMins = estimatedWaitMins; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
