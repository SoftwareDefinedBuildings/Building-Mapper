var acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
};

var CreatorPage = function(imageHolder) {
    var that = this;

    this.imageFile = null;

    // set child elements
    this.children = {};
    this.children.imageHolder = imageHolder;

    // set holder callbacks
    this.children.imageHolder.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.children.imageHolder.addClass('hover');
    });

    this.children.imageHolder.on('dragend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.children.imageHolder.removeClass('hover');
    });

    this.children.imageHolder.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        that.children.imageHolder.removeClass('hover');
        if (e.originalEvent.dataTransfer.files.length === 1) {
            that.setImage(e.originalEvent.dataTransfer.files[0]);
        }
    });
};


CreatorPage.prototype.uploadImage = function(file) {
    $.ajax({
        url: '/up',
        type: 'POST',
        processData: false,
        contentType: 'application/octet-stream',
        beforeSend: function(request) {
            request.setRequestHeader("X-File-Name", file.name);
        },
        data: file
    });
};

CreatorPage.prototype.setImage = function(file) {
    this.previewFile(file);
    this.imageFile = file;
    this.children.imageHolder.addClass('solidified');
};

CreatorPage.prototype.previewFile = function(file) {
    var that = this;
    if (file && acceptedTypes[file.type] === true) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var image = new Image();
            image.src = event.target.result;
            image.className = 'floor-img';
            that.children.imageHolder.html("");
            that.children.imageHolder.append(image);
        };

        reader.readAsDataURL(file);
    }  else {
        console.log('Not an acceptable file type!');
        console.log(file);
    }
};

