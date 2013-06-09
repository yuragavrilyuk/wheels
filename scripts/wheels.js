var wheels = {
    mantra: undefined
    ,
    fileName: "mantra.txt"
    ,
    doms: {
        generate: {
            obj: undefined
            ,
            id: "generate"
        }
        ,
        download: {
            obj: undefined
            ,
            id: "download"
        }
        ,
        download_target: {
            obj: undefined
            ,
            id: "download-target"
        }
        ,
        mantra: {
            obj: undefined
            ,
            id: "mantra"
        }
        ,
        mantra: {
            obj: undefined
            ,
            id: "mantra"
        }
        ,
        file_size: {
            obj: undefined
            ,
            id: "file-size"
        }
        ,
        error_message: {
            obj: undefined
            ,
            id: "error-message"
        }
        ,
        all_controls: {
            obj: undefined
            ,
            id: "all-controls"
        }
}
    ,
    init: function () {
        wheels.clearMantra();
        wheels.createFirstDom();
        if (!wheels.exists("Blob")) {
            wheels.validator.showError(wheels.validator.messages.blobsNotSupported);
            return;
        }
        wheels.createDoms();
        wheels.doms.all_controls.obj.show();
        wheels.bindEvents();
    }
    ,
    createFirstDom: function () {
        wheels.doms.all_controls.obj = $("#" + wheels.doms.all_controls.id);
    }
    ,
    createDoms: function () {
        wheels.doms.generate.obj = $("#" + wheels.doms.generate.id);
        wheels.doms.download.obj = $("#" + wheels.doms.download.id);
        wheels.doms.download_target.obj = $("#" + wheels.doms.download_target.id);
        wheels.doms.mantra.obj = $("#" + wheels.doms.mantra.id);
        wheels.doms.file_size.obj = $("#" + wheels.doms.file_size.id);
        wheels.doms.error_message.obj = $("#" + wheels.doms.error_message.id);
    }
    ,
    clearMantra: function () {
        wheels.mantra = "";
    }
    ,
    validator: {
        validate: function () {
            if (!wheels.validator._validate(wheels.validator.data.required)) {
                return false;
            }
            if (!wheels.validator._validate(wheels.validator.data.number)) {
                return false;
            }
            if (parseInt(wheels.doms.file_size.obj.val()) < 0) {
                return false;
            }
            return true;
        }
        ,
        data: {
            required: {
                regex: ".+"
                ,
                selector: ".required"
            }
            ,
            number: {
                regex: "^\\d+$"
                ,
                selector: ".number"
            }
        }
        ,
        messages: {
            emptyFile: "empty file"
            ,
            validationFailed: "validation failed"
            ,
            blobsNotSupported: "your browser does not support client-side files generation"
        }
        ,
        _validate: function (data) {
            function validate(value) {
                var regex = new RegExp(data.regex);
                return regex.test(value);
            }
            var result = true;
            $("input" + data.selector + "[type='text']").each(function (key) {
                var _this = $(this);
                if (!validate(_this.val())) {
                    result = false;
                    return;
                }
            });
            return result;
        }
        ,
        showError: function (message) {
            wheels.doms.error_message.obj.html(message);
            wheels.doms.download_target.obj.hide();
            wheels.doms.error_message.obj.show();
        }
        ,
        hideError: function () {
            wheels.doms.error_message.obj.hide();
            wheels.doms.download_target.obj.show();
            wheels.doms.error_message.obj.html("");
        }
    }
    ,
    bindEvents: function () {
        wheels.doms.generate.obj.click(function () {
            wheels.validator.hideError();
            if (!wheels.validator.validate()) {
                wheels.validator.showError(wheels.validator.messages.validationFailed);
                return;
            }
            var mantraText = wheels.doms.mantra.obj.val()
                ,
                mantraTextLength = mantraText.length
                ,
                mantraTextFixed = mantraText + " "
                ,
                mantraTextFixedLength = mantraTextFixed.length
                ,
                fileSizeValue = wheels.doms.file_size.obj.val()
                ,
                fileLength = fileSizeValue - (fileSizeValue % mantraTextFixedLength)
                ,
                fileLengthFixed = fileLength - 1
                ,
                limit = (fileLength / mantraTextFixedLength);
            if (limit <= 0) {
                wheels.validator.showError(wheels.validator.messages.emptyFile);
                return;
            }
            wheels.clearMantra();
            try {
                for (var i = 0; i < limit - 1; i++) {
                    wheels.mantra += mantraTextFixed;
                }
                wheels.mantra += mantraText;
            } catch (exception) {
                wheels.validator.showError(exception.message);
                return;
            }
            window.URL = window.webkitURL || window.URL;
            var blob = new Blob([wheels.mantra], { type: "text/plain" })
                ,
                href = window.URL.createObjectURL(blob);
            wheels.doms.download.obj.attr("href", href);
            wheels.doms.download.obj.attr("download", wheels.fileName);
            wheels.doms.download_target.obj.find(".mantra").html(mantraText);
            wheels.doms.download_target.obj.find(".mantra-size").html(mantraTextLength);
            wheels.doms.download_target.obj.find(".mantras-qty").html(limit);
            wheels.doms.download_target.obj.find(".file-size").html(fileLengthFixed);
        });
    }
    ,
    exists: function (name) {
        try {
            if (window[name]) {
                return true;
            }
            throw name;
        } catch (exception) {
            return false;
        }
    }
};
$(document).ready(function () {
    wheels.init();
});