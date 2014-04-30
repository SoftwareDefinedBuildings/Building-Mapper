var ViewPage = function(floorLabel, imageHolder) {
    this.children = {};
    this.children.imageHolder = imageHolder;

    this.floorLabel = floorLabel;
};

ViewPage.prototype.fetchData = function() {
};

ViewPage.prototype.fetchFloor = function() {
    $.ajax({
        url: '/fetch/floor/' + this.floorLabel,
        type: 'POST',
        processData: false,
        contentType: 'application/octet-stream',
        beforeSend: function(request) {
            request.setRequestHeader("X-File-Name", file.name);
        },
        data: file,
        success: this.submitData.bind(this)
    });
};

ViewPage.prototype.renderFloor = function() {
};
