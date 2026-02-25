// Custom error class to create structured errors with status codes
// Extends the built-in JavaScript Error class

class CustomErrorHandler extends Error {

    // Constructor receives HTTP status code and error message
    constructor(statusCode, message) {
        super(); // Call parent Error constructor

        // Store status code for HTTP response
        this.statusCode = statusCode;

        // Store error message
        this.message = message;
    }
}

// Export the custom error class for use in routes and middleware
module.exports = CustomErrorHandler;