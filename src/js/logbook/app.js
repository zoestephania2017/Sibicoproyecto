import { read } from "../module/services/services-min.js";

document.addEventListener("DOMContentLoaded", async () => {
    const logbook = document.querySelector("#logbook");
    const data = await read('../../app/controllers/LogbookController.php');

    const sortedData = data.sort((a, b) => {
        return new Date(b.substring(1, 20)) - new Date(a.substring(1, 20));
    });

    sortedData.forEach(log => {
        const logEntry = document.createElement("div");
        const logElements = parseLogEntry(log);
        const formattedLog = formatLogEntry(logElements);

        logEntry.innerHTML = `<pre class="whitespace-pre-wrap text-sm">${formattedLog}</pre>`;

        logbook.appendChild(logEntry);
    });
});

function parseLogEntry(log) {
    const matches = log.match(/\[(.*?)\]/g);

    if (matches && matches.length >= 5) {
        const timestamp = matches[0];
        const type = matches[1];
        const username = matches[2];
        const severity = matches[3];
        const results = matches[4];

        let description = log;
        matches.forEach(match => {
            description = description.replace(match, '');
        });

        description = description.trim();

        return [timestamp, type, username, severity, results, description];
    } else {
        return [];
    }
}

function formatLogEntry(logElements) {
    const [timestamp, type, username, severity, results, description] = logElements;

    const severityColors = {
        "[bajo]": "text-gray-500",
        "[normal]": "text-blue-500",
        "[medio]": "text-yellow-500",
        "[alto]": "text-orange-500",
        "[critico]": "text-red-500"
    };

    const severityColor = severityColors[severity] || "text-gray-500";

    return `<span class="text-blue-500">${timestamp}</span> <span class="text-yellow-500">${type}</span> <span class="text-green-500">${username}</span> <span class="${severityColor}">${severity}</span> <span class="text-purple-500">${results}</span> ${description}`;
}