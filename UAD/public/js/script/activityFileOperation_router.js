const Admin = require('../../../server/controller/seq_admin');


module.exports = function (app) {
    app.get('/seq_page', Admin.get_homepage);
    app.post('/save_as_file', Admin.save_as_file);
    app.post('/get_ref', Admin.get_ref);
    app.post('/download_ref', Admin.download_ref);
    app.post('/ref_diagram', Admin.ref_diagram)
    app.post('/add_ref', Admin.add_ref)
    app.post('/import_file_info', Admin.import_file_info)
    app.post('/save_to_file', Admin.save_to_file)
    app.post('/file_exist', Admin.file_exist)
    app.post('/tesurl',Admin.tesurl)
}