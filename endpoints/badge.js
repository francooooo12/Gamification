function endpoint(app, connpool) {

    app.post("/api/badge", (req, res) => {
        var errors = [];
        if (!req.body.Descrizione) {
            errors.push("Descrizione non specificato");
        }
        if (!req.body.Regola) {
            errors.push("Regola non specificato");
        }
        if (errors.length) {
            res.status(400).json({ "error": errors.join(", ") });
            return;
        }
        var data = {
            Descrizione: req.body.Descrizione,
            Regola: req.body.Regola,
        };

        var sql = 'INSERT INTO badge (Descrizione, Regola) VALUES (?,?)';
        var params = [data.Descrizione, data.Regola, data.studenteID];
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

    app.get("/api/badge", (req, res) => {
        var sql = "SELECT * FROM badge";
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

    app.get("/api/badge/:id", (req, res) => {
        var sql = "SELECT * FROM badge WHERE id = ?";
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

    app.put("/api/badge/:id", (req, res) => {
        var data = {
            Descrizione: req.body.Descrizione,
            Regola: req.body.Regola,
        };
        connpool.execute(
            `UPDATE badge SET 
               Descrizione = COALESCE(?, Descrizione), 
               Regola = COALESCE(?, Regola), 
               WHERE id = ?`,
            [data.Descrizione, data.Regola, req.params.id],
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

    app.delete("/api/badge/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM badge WHERE id = ?',
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
