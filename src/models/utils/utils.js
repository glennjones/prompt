
// This function is used to download a file from a url and save it to a local file.

/*
async function download(url, destination_file) {
    let headers = {};

    let path = user_cache_dir("promptify");

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    destination_file = path + "/" + destination_file;

    if (fs.existsSync(destination_file)) {
        let mtime = fs.statSync(destination_file).mtime;
        headers["if-modified-since"] = formatdate(mtime, usegmt=True);
    }

    let response = await fetch(url, {headers: headers});
    if (response.status == 304) {
        return;
    }

    if (response.status == 200) {
        let file = fs.createWriteStream(destination_file);
        response.body.pipe(file);
        if (last_modified = response.headers.get("last-modified")) {
            let new_mtime = parsedate_to_datetime(last_modified).timestamp();
            fs.utimesSync(destination_file, new_mtime, new_mtime);
        }
    }
    return destination_file;
}
*/