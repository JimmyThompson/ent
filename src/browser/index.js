var $ = require("jquery");
var ipc = require("ipc");
var xmldom = require("xmldom");

var parser = require("../app/parser");
var generator = require("./image_generator");

var $success = $(".alert.success");
var $error = $(".alert.error");

var $content = document.getElementById("content");
var $textarea = document.getElementById("text-area");

var renderTree = function () {
    try {
        var root = parser.parse($textarea.value);
        generator.clear();

        generator.generate(root, $content);
    } catch (error) {
        showErrorMessage("Could not create tree from the text");
    }
};

var showErrorMessage = function (message) {
    $error.text(message);
    $error.fadeIn("slow", function () {
        setTimeout(function () {
            $error.fadeOut("slow");
        }, 2000);
    });
};

var showSuccessMessage = function (message) {
    $success.text(message);
    $success.fadeIn("slow", function () {
        setTimeout(function () {
            $success.fadeOut("slow");
        }, 2000);
    });
};

$("#generate").on("click", renderTree);

$("#load").on("click", function () {
    ipc.send("dialog:open");
});

ipc.on("open:success", function(fileContents) {
    $textarea.value = fileContents;
    renderTree();
    showSuccessMessage("Loaded file successfully");
});

$("#save").on("click", function () {
    ipc.send("dialog:save", $textarea.value);
});

ipc.on("save:success", function () {
    showSuccessMessage("Saved successfully");
});
