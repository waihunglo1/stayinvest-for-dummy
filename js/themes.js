var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

function appendThemesLink(data, key, parent) {
    var themes = getObjectByValue(data.themes, "name", "DOW")[0];
    var linkElement = document.createElement('a');
    linkElement.href = "snapshots-aa.html?t=US&o=" + themes.holdings.join();
    linkElement.setAttribute("target", "_blank");
    linkElement.text = themes.name;
    parent.appendChild(linkElement);
}

function fetchJSONData() {
    fetch("data/sample.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            appendThemesLink(data, "DOW", img_home);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
}
fetchJSONData();
