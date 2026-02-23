// Utility function to handle async errors in Express routes
// It wraps an async function and automatically passes errors to next()

module.exports = (fn) => {
    return function(req, res, next) {
        // Execute the async function
        // If it throws an error, catch it and pass it to Express error handler
        fn(req, res, next).catch(next);
    };
};

/* We didn’t pass err explicitly… so how is it reaching error middleware?
        .catch(next)

        This is shorthand for:

        .catch((err) => {
        next(err);
        })

                                Async route throws error
                                        ↓
                                Promise rejects
                                        ↓
                                .catch() gets error automatically
                                        ↓
                                    next(err)
                                        ↓
                                Express error handler

 The error is automatically passed into .catch() by the rejected promise, and .catch(next) forwards it to Express. */