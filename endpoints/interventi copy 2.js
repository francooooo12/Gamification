function endpoint(app, connpool) {

    app.post("/api/interventi", (req, res) => {
        var errors = [];
        if (!req.body.tipo) {
            errors.push("Tipo di intervento non specificato");
        }
        if (!req.body.lezioneID) {
            errors.push("ID lezione non specificato");
        }
        if (!req.body.studenteID) {
            errors.push("ID studente non specificato");
        }
        if (errors.length) {
            res.status(400).json({ "error": errors.join(", ") });
            return;
        }
        var data = {
            tipo: req.body.tipo,
            lezioneID: req.body.lezioneID,
            studenteID: req.body.studenteID,
        };

        var sql = 'INSERT INTO interventi (tipo, lezioneID, studenteID) VALUES (?,?,?)';
        var params = [data.tipo, data.lezioneID, data.studenteID];
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message });
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": results.insertId
            });
        });

    });

    app.get("/api/interventi", (req, res) => {
        var sql = "SELECT * FROM interventi";
        connpool.query(sql, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            });
        });
    });

    app.get("/api/interventi/:id", (req, res) => {
        var sql = "SELECT * FROM interventi WHERE id = ?";
        var params = [req.params.id];
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows[0]
            });
        });
    });

    app.put("/api/interventi/:id", (req, res) => {
        var data = {
            tipo: req.body.tipo,
            lezioneID: req.body.lezioneID,
            studenteID: req.body.studenteID,
        };
        connpool.execute(
            `UPDATE interventi SET 
               tipo = COALESCE(?, tipo), 
               lezioneID = COALESCE(?, lezioneID), 
               studenteID = COALESCE(?, studenteID) 
               WHERE id = ?`,
            [data.tipo, data.lezioneID, data.studenteID, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                });
            });
    });

    app.delete("/api/interventi/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM interventi WHERE id = ?',
            [req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.json({ "message": "deleted", changes: result.affectedRows });
            });
    });

}

module.exports = endpoint;
