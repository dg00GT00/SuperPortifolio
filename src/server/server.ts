import {createServer, IncomingMessage, RequestListener, ServerResponse} from "http";
import {readFile} from "fs/promises";
import {resolve, extname} from "path";

type ServerObj = {
    fileToRead: string,
    headers: { "Content-Type": string }
};

const PORT = 8080;
const HOST = "localhost";

const buildFilePath = (file: string | undefined): string => {
    if (file) {
        if (file[0] === "/") {
            file = file.substring(1, file.length);
        }
        return resolve(__dirname, "..", file);
    }
    throw new Error("No file found");
}

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".js": "application/javascript",
    ".json": "application/json",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm"
};
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
};

const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse): void => {
    let serverObj: ServerObj = {
        fileToRead: buildFilePath("index.html"),
        headers: {
            "Content-Type": mimeTypes[".html"]
        }
    };

    if (req.url !== "/") {
        const fileToRead = buildFilePath(req.url);
        const fileExt = extname(fileToRead);

        if (fileExt === ".js") {
            serverObj = {
                ...serverObj,
                ...corsHeaders,
                fileToRead,
                headers: {
                    "Content-Type": mimeTypes[fileExt]
                }
            }
        } else {
            serverObj = {
                ...serverObj,
                headers: {
                    "Content-Type": mimeTypes[fileExt as keyof typeof mimeTypes] ?? "application/octet-stream"
                }
            }
        }
    }

    readFile(serverObj.fileToRead)
        .then(value => {
            res.writeHead(200, serverObj.headers);
            res.end(value, "utf8");
        })
        .catch(_ => {
            res.writeHead(404);
            res.emit("close");
            res.end();
        });
}

const server = createServer(requestListener);

server.on("close", () => {
    server.close(err => console.log("Server close due to an error"));
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on: http://${HOST}:${PORT}`);
});