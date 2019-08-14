const crypto = require('crypto');

class ResultsManager {
    constructor() {
        if (ResultsManager.singleton) {
            return ResultsManager.singleton;
        }
        this.activeRunIds = new Set();
        this.runIdToResults = {}; // runId --> [arrayOfResults, verdict]
        ResultsManager.singleton = this;
        return ResultsManager.singleton;
    }

    /**
     * Returns the results manager (a singleton).
     * @return ResultsManager
     */
    static getResultsManager() {
        var res = new ResultsManager();
        return res;
    }

    /**
     * Returns a random RunId that is currently not in use. This function also updates the set of active run ids.
     * @return A fresh Id
     */
    getFreshRunId() {
        var res = crypto.randomBytes(8).toString('hex');
        while (this.activeRunIds.has(res)) {
            res = crypto.randomBytes(8).toString('hex');
        }
        this.activeRunIds.add(res);
        return res;

    }

    /**
     * Updates the results of a test, given test id (runId), array of test results and a verdict ("success", "failure").
     * @param runId
     * @param testResults
     * @verdict
     * @return void
     *
     */
    updateTestResults (runId, testResults, verdict) {
        if (this.activeRunIds.has(runId)) {
            this.runIdToResults[runId] = new Array(2);
            this.runIdToResults[runId][0] = testResults;
            this.runIdToResults[runId][1] = verdict;
        }
    }

    /**
     * Deletes results of a given runId from this.runIds and from this.runIdToResults.
     * @param runId
     * @return void
     */
    deleteTestResult(runId) {
        if (this.activeRunIds.has(runId)) {
            this.activeRunIds.delete(runId);
            delete this.runIdToResults[runId];
        }
    }

    /**
     * Returns the test results of a given runId.
     * @param runId
     * @return The array representing the tests results of the given runId. If test results is not ready, null is returned.
     */
    getTestResults(runId) {
        if (this.runIdToResults.hasOwnProperty(runId)) { // If test results are ready
            return this.runIdToResults[runId]; // Return them.
        }
        else {
            return null; // Else, null is returned.
        }
    }

}

module.exports = ResultsManager;