module.exports = {
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy"
    },
    setupFilesAfterEnv: ["./configs/enzyme"]
}